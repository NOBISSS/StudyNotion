import { jest } from "@jest/globals";
import "../otp.mocks.js";
declare const verifyOTP: ({ email, userOtp, otpType, }: {
    email: string;
    userOtp: string;
    otpType: "registration" | "forgot";
}) => Promise<import("../../../src/shared/utils/otp.service.js").OTPData | null>;
export declare const verifyPayload: {
    otp: string;
};
export declare const URL: string;
export declare const mockVerifyOTP: jest.MockedFunction<typeof verifyOTP>;
export declare const mockOtpData: {
    otp: string;
    firstName: string;
    lastName: string;
    password: string;
    accountType: "student";
    otpType: "registration";
};
export declare function buildOtpCookie(overrides?: {
    email?: string;
    type?: string;
}): string;
export {};
//# sourceMappingURL=signup-verification.fixtures.d.ts.map