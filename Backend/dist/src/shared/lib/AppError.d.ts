export type ErrorCode = 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'RATE_LIMITED' | 'PAYMENT_FAILED' | 'OTP_EXPIRED' | 'OTP_INVALID' | 'OTP_MAX_ATTEMPTS' | 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'INTERNAL_ERROR';
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: ErrorCode;
    isOperational: boolean;
    readonly meta?: Record<string, unknown> | undefined;
    constructor(message: string, statusCode: number, code: ErrorCode, meta?: Record<string, unknown>);
    static badRequest(message: string, meta?: Record<string, unknown>): AppError;
    static unauthorized(message?: string): AppError;
    static forbidden(message?: string): AppError;
    static notFound(resource: string): AppError;
    static conflict(message: string): AppError;
    static otpExpired(): AppError;
    static otpInvalid(): AppError;
    static rateLimited(message?: string): AppError;
    static internal(message?: string): AppError;
}
//# sourceMappingURL=AppError.d.ts.map