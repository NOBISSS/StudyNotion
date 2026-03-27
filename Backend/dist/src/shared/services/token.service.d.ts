import { Types } from "mongoose";
import { type IUser, type UserDocument } from "../../modules/user/UserModel.js";
export interface AccessTokenPayload {
    sub: string;
    accountType: IUser["accountType"];
    sessionId: string;
    iat?: number;
    exp?: number;
}
export interface RefreshTokenPayload {
    sub: string;
    sessionId: string;
    iat?: number;
    exp?: number;
}
declare class TokenService {
    generateAccessToken(payload: Omit<AccessTokenPayload, "iat" | "exp"> & {
        _id: Types.ObjectId;
        email: string;
    }): string;
    generateRefreshToken(payload: Omit<RefreshTokenPayload, "iat" | "exp">): string;
    verifyAccessToken(token: string): UserDocument;
    verifyRefreshToken(token: string): UserDocument & RefreshTokenPayload;
    storeRefreshToken(userId: string, sessionId: string, token: string, ttlSeconds: number): Promise<void>;
    validateAndRotateRefreshToken(token: string, userId: string, sessionId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    rotateTokens(oldRefreshToken: string, user: {
        _id: string;
        accountType: IUser["accountType"];
        email: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        sessionId: string;
    }>;
    revokeSession(userId: string, sessionId: string): Promise<void>;
    revokeAllSessions(userId: string): Promise<void>;
    private hashToken;
    private compareTokenHash;
    private parseTTL;
}
export declare const tokenService: TokenService;
export {};
//# sourceMappingURL=token.service.d.ts.map