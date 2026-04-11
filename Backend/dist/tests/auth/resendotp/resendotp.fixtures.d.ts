import { jest } from "@jest/globals";
import { canResendOTP, getOTPData } from "../../../src/shared/utils/otp.service.js";
export declare const URL: string;
export declare const mockCanResendOTP: jest.MockedFunction<typeof canResendOTP>;
export declare const mockCanResendData = true;
export declare const mockGetOTP: jest.MockedFunction<typeof getOTPData>;
export declare const mockGetOTPData: {
    otp: string;
    firstName: string;
    lastName: string;
    password: string;
    accountType: "student";
    otpType: "registration";
};
//# sourceMappingURL=resendotp.fixtures.d.ts.map