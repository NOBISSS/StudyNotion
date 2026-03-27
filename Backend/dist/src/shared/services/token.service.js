import jwt, {} from "jsonwebtoken";
import { Types } from "mongoose";
import {} from "../../modules/user/UserModel.js";
import redis from "../config/redis.js";
import { AppError } from "../lib/AppError.js";
const env = process.env;
const KEYS = {
    refreshToken: (userId, sessionId) => `auth:refresh:${userId}:${sessionId}`,
    tokenBlacklist: (jti) => `auth:blacklist:${jti}`,
    sessionList: (userId) => `auth:sessions:${userId}`,
};
class TokenService {
    generateAccessToken(payload) {
        return jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
            algorithm: "HS256",
        });
    }
    generateRefreshToken(payload) {
        return jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
            algorithm: "HS256",
        });
    }
    verifyAccessToken(token) {
        try {
            const payload = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET);
            return payload;
        }
        catch (err) {
            if (err.name === "TokenExpiredError") {
                throw AppError.unauthorized("Unauthorized: Access token expired");
            }
            throw AppError.unauthorized("Unauthorized: Invalid access token");
        }
    }
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
        }
        catch (err) {
            if (err.name === "TokenExpiredError") {
                throw AppError.unauthorized("Unauthorized: Refresh token expired");
            }
            throw AppError.unauthorized("Unauthorized: Invalid refresh token");
        }
    }
    async storeRefreshToken(userId, sessionId, token, ttlSeconds) {
        const hash = await this.hashToken(token);
        const key = KEYS.refreshToken(userId, sessionId);
        await redis.set(key, hash, "EX", ttlSeconds);
        await redis.sadd(KEYS.sessionList(userId), sessionId);
        await redis.expire(KEYS.sessionList(userId), ttlSeconds);
    }
    async validateAndRotateRefreshToken(token, userId, sessionId) {
        const storedHash = await redis.get(KEYS.refreshToken(userId, sessionId));
        if (!storedHash) {
            throw AppError.unauthorized("Session expired or not found");
        }
        const isValid = await this.compareTokenHash(token, storedHash);
        if (!isValid) {
            await this.revokeAllSessions(userId);
            throw AppError.unauthorized("Unauthorized: Refresh token reuse detected. All sessions revoked.");
        }
        await redis.del(KEYS.refreshToken(userId, sessionId));
        throw new Error("Call rotateTokens() instead");
    }
    async rotateTokens(oldRefreshToken, user) {
        const payload = this.verifyRefreshToken(oldRefreshToken);
        const { sub: userId, sessionId } = payload;
        if (userId !== user._id) {
            throw AppError.unauthorized("Unauthorized: Token user mismatch");
        }
        const storedHash = await redis.get(KEYS.refreshToken(userId, sessionId));
        if (!storedHash)
            throw AppError.unauthorized("Unauthorized: Session expired");
        const isValid = await this.compareTokenHash(oldRefreshToken, storedHash);
        if (!isValid) {
            await this.revokeAllSessions(userId);
            throw AppError.unauthorized("Unauthorized: Refresh token reuse detected");
        }
        await redis.del(KEYS.refreshToken(userId, sessionId));
        const newSessionId = new Types.ObjectId().toString();
        const accessToken = this.generateAccessToken({
            sub: userId,
            accountType: user.accountType,
            sessionId: newSessionId,
            _id: new Types.ObjectId(userId),
            email: user.email,
        });
        const refreshToken = this.generateRefreshToken({
            sub: userId,
            sessionId: newSessionId,
        });
        const refreshTTL = this.parseTTL(env.JWT_REFRESH_TOKEN_EXPIRES_IN);
        await this.storeRefreshToken(userId, newSessionId, refreshToken, refreshTTL);
        return { accessToken, refreshToken, sessionId: newSessionId };
    }
    async revokeSession(userId, sessionId) {
        await redis.del(KEYS.refreshToken(userId, sessionId));
        await redis.srem(KEYS.sessionList(userId), sessionId);
    }
    async revokeAllSessions(userId) {
        const sessionIds = await redis.smembers(KEYS.sessionList(userId));
        const pipeline = redis.pipeline();
        for (const sessionId of sessionIds) {
            pipeline.del(KEYS.refreshToken(userId, sessionId));
        }
        pipeline.del(KEYS.sessionList(userId));
        await pipeline.exec();
    }
    async hashToken(token) {
        const { createHash } = await import("crypto");
        return createHash("sha256").update(token).digest("hex");
    }
    async compareTokenHash(token, hash) {
        const { createHash } = await import("crypto");
        const tokenHash = createHash("sha256").update(token).digest("hex");
        return tokenHash === hash;
    }
    parseTTL(expiresIn) {
        const units = { s: 1, m: 60, h: 3600, d: 86400 };
        const match = expiresIn.match(/^(\d+)([smhd])$/);
        if (!match || !match[1] || !match[2] || !(match[2] in units)) {
            throw new Error(`Invalid expiresIn format: ${expiresIn}`);
        }
        return parseInt(match[1]) * units[match[2]];
    }
}
export const tokenService = new TokenService();
//# sourceMappingURL=token.service.js.map