import { endpoints } from "../../../src/endpoints.js";
import { jest } from "@jest/globals";
import { canResendOTP, getOTPData, } from "../../../src/shared/utils/otp.service.js";
export const URL = endpoints.auth.resendOTP.base;
export const mockCanResendOTP = jest.mocked(canResendOTP);
export const mockCanResendData = true;
export const mockGetOTP = jest.mocked(getOTPData);
export const mockGetOTPData = {
    otp: "123456",
    firstName: "Arafat",
    lastName: "Mansuri",
    password: "hashed-password",
    accountType: "student",
    otpType: "registration",
};
//# sourceMappingURL=resendotp.fixtures.js.map