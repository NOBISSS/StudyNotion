// src/services/token.service.ts
import jwt, { type SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import { type IUser, type UserDocument } from "../../modules/user/UserModel.js";
import { env } from "../config/env.js";
import redis  from "../config/redis.js";
import { AppError } from "../lib/AppError.js";

export interface AccessTokenPayload {
  sub: string; // userId
  accountType: IUser["accountType"];
  sessionId: string; // ties token to a specific session
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

// Redis key patterns — centralized to prevent key naming drift
const KEYS = {
  refreshToken: (userId: string, sessionId: string) =>
    `auth:refresh:${userId}:${sessionId}`,
  tokenBlacklist: (jti: string) => `auth:blacklist:${jti}`,
  sessionList: (userId: string) => `auth:sessions:${userId}`,
} as const;

class TokenService {
  generateAccessToken(
    payload: Omit<AccessTokenPayload, "iat" | "exp">,
  ): string {
    return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      algorithm: "HS256",
    } as SignOptions);
  }

  generateRefreshToken(
    payload: Omit<RefreshTokenPayload, "iat" | "exp">,
  ): string {
    return jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      algorithm: "HS256",
    } as SignOptions);
  }

  verifyAccessToken(
    token: string,
  ): UserDocument {
    try {
      const payload = jwt.verify(
        token,
        env.JWT_ACCESS_TOKEN_SECRET,
      ) as UserDocument;
      return payload;
    } catch (err) {
      if ((err as any).name === "TokenExpiredError") {
        throw AppError.unauthorized("Access token expired");
      }
      throw AppError.unauthorized("Invalid access token");
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
    } catch (err) {
      if ((err as any).name === "TokenExpiredError") {
        throw AppError.unauthorized("Refresh token expired");
      }
      throw AppError.unauthorized("Invalid refresh token");
    }
  }

  // Store refresh token hash in Redis (not the raw token)
  async storeRefreshToken(
    userId: string,
    sessionId: string,
    token: string,
    ttlSeconds: number,
  ): Promise<void> {
    const hash = await this.hashToken(token);
    const key = KEYS.refreshToken(userId, sessionId);
    await redis.set(key, hash, "EX", ttlSeconds);
    // Track sessions per user (for "logout all devices")
    await redis.sadd(KEYS.sessionList(userId), sessionId);
    await redis.expire(KEYS.sessionList(userId), ttlSeconds);
  }

  async validateAndRotateRefreshToken(
    token: string,
    userId: string,
    sessionId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const storedHash = await redis.get(KEYS.refreshToken(userId, sessionId));

    if (!storedHash) {
      throw AppError.unauthorized("Session expired or not found");
    }

    const isValid = await this.compareTokenHash(token, storedHash);
    if (!isValid) {
      // Possible token theft — invalidate ALL sessions for this user
      await this.revokeAllSessions(userId);
      throw AppError.unauthorized(
        "Refresh token reuse detected. All sessions revoked.",
      );
    }

    // Delete old token immediately (rotation)
    await redis.del(KEYS.refreshToken(userId, sessionId));

    // Fetch user for new token payload
    // Caller is responsible for providing user data
    throw new Error("Call rotateTokens() instead");
  }

  async rotateTokens(
    oldRefreshToken: string,
    user: { _id: string; accountType: IUser["accountType"] },
  ): Promise<{ accessToken: string; refreshToken: string; sessionId: string }> {
    const payload = this.verifyRefreshToken(oldRefreshToken);
    const { sub: userId, sessionId } = payload;

    if (userId !== user._id) {
      throw AppError.unauthorized("Token user mismatch");
    }

    const storedHash = await redis.get(KEYS.refreshToken(userId, sessionId));
    if (!storedHash) throw AppError.unauthorized("Session expired");

    const isValid = await this.compareTokenHash(oldRefreshToken, storedHash);
    if (!isValid) {
      await this.revokeAllSessions(userId);
      throw AppError.unauthorized("Refresh token reuse detected");
    }

    // Invalidate old
    await redis.del(KEYS.refreshToken(userId, sessionId));

    // Issue new tokens with same sessionId
    const newSessionId = new Types.ObjectId().toString();
    const accessToken = this.generateAccessToken({
      sub: userId,
      accountType: user.accountType,
      sessionId: newSessionId,
    });
    const refreshToken = this.generateRefreshToken({
      sub: userId,
      sessionId: newSessionId,
    });

    const refreshTTL = this.parseTTL(env.JWT_REFRESH_TOKEN_EXPIRES_IN);
    await this.storeRefreshToken(
      userId,
      newSessionId,
      refreshToken,
      refreshTTL,
    );

    return { accessToken, refreshToken, sessionId: newSessionId };
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await redis.del(KEYS.refreshToken(userId, sessionId));
    await redis.srem(KEYS.sessionList(userId), sessionId);
  }

  async revokeAllSessions(userId: string): Promise<void> {
    const sessionIds = await redis.smembers(KEYS.sessionList(userId));
    const pipeline = redis.pipeline();
    for (const sessionId of sessionIds) {
      pipeline.del(KEYS.refreshToken(userId, sessionId));
    }
    pipeline.del(KEYS.sessionList(userId));
    await pipeline.exec();
  }

  private async hashToken(token: string): Promise<string> {
    const { createHash } = await import("crypto");
    return createHash("sha256").update(token).digest("hex");
  }

  private async compareTokenHash(
    token: string,
    hash: string,
  ): Promise<boolean> {
    const { createHash } = await import("crypto");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    return tokenHash === hash;
  }

  private parseTTL(expiresIn: string): number {
    const units: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match || !match[1] || !match[2] || !(match[2] in units)) {
      throw new Error(`Invalid expiresIn format: ${expiresIn}`);
    }
    return parseInt(match[1]) * units[match[2]]!;
  }
}

export const tokenService = new TokenService();
