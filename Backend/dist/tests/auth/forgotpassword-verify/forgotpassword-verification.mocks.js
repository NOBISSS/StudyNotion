import { jest } from "@jest/globals";
import { endpoints } from "../../../src/endpoints.js";
import "../otp.mocks.js";
const { verifyOTP } = await import("../../../src/shared/utils/otp.service.js");
export const verifyPayload = {
    otp: 123456,
    password: "NewPassword@456",
};
export const URL = endpoints.auth.forgotpassword.verify;
export const mockVerifyOTP = jest.mocked(verifyOTP);
export const mockOtpData = {
    otp: "123456",
    otpType: "forgot",
};
export function buildOtpCookie(overrides) {
    const payload = {
        email: overrides?.email ?? "arafat@test.com",
        type: overrides?.type ?? "forget",
    };
    const value = `j:${JSON.stringify(payload)}`;
    return `otp_data=${encodeURIComponent(value)}`;
}
export async function seedUser(overrides) {
    const User = (await import("../../../src/modules/user/UserModel.js")).default;
    return User.create({
        firstName: "Arafat",
        lastName: "Mansuri",
        email: overrides?.email ?? "arafat@test.com",
        password: "hashed-password",
        accountType: "student",
        isBanned: false,
        isDeleted: false,
    });
}
//# sourceMappingURL=forgotpassword-verification.mocks.js.map