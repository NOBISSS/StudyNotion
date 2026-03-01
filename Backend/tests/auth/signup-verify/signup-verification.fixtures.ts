import { jest } from "@jest/globals";
import { endpoints } from "../../../src/endpoints.js";
import { accountTypes } from "../../../src/modules/auth/auth.type.js";
import "../otp.mocks.js";
const { verifyOTP } = await import("../../../src/shared/utils/otp.service.js");

export const verifyPayload = {
  otp: "123456",
};

export const URL = endpoints.auth.signup.verify;
// Cast to jest.Mock so TypeScript allows .mockResolvedValueOnce
export const mockVerifyOTP = jest.mocked(verifyOTP) as jest.MockedFunction<
  typeof verifyOTP
>;
export const mockOtpData = {
  otp: "123456",
  firstName: "Arafat",
  lastName: "Mansuri",
  password: "hashed-password",
  accountType: "student" as const,
  otpType: "registration" as const,
};

/**
 * Builds the otp_data cookie string exactly as Express sets it —
 * URL-encoded with the j: prefix that cookie-parser adds for object values.
 * Pass this to supertest via .set("Cookie", buildOtpCookie(...))
 */
export function buildOtpCookie(overrides?: {
  email?: string;
  type?: string;
}): string {
  const payload = {
    email: overrides?.email ?? "arafat@test.com",
    type: overrides?.type ?? "signup",
    // OTPMode: "email",
    // isOTPVerified: overrides?.isOTPVerified ?? false,
  };
  const value = `j:${JSON.stringify(payload)}`;
  return `otp_data=${encodeURIComponent(value)}`;
}
