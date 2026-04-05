import { jest } from "@jest/globals";
import { endpoints } from "../../../src/endpoints.js";
import "../otp.mocks.js";
const { verifyOTP } = await import("../../../src/shared/utils/otp.service.js");
export const verifyPayload = {
    otp: "123456",
};
export const URL = endpoints.auth.signup.verify;
export const mockVerifyOTP = jest.mocked(verifyOTP);
export const mockOtpData = {
    otp: "123456",
    firstName: "Arafat",
    lastName: "Mansuri",
    password: "hashed-password",
    accountType: "student",
    otpType: "registration",
};
export function buildOtpCookie(overrides) {
    const payload = {
        email: overrides?.email ?? "arafat@test.com",
        type: overrides?.type ?? "signup",
    };
    const value = `j:${JSON.stringify(payload)}`;
    return `otp_data=${encodeURIComponent(value)}`;
}
//# sourceMappingURL=signup-verification.fixtures.js.map