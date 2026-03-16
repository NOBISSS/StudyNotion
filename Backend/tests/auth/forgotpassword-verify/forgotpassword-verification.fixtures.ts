import { jest } from "@jest/globals";
import { endpoints } from "../../../src/endpoints.js";
import "../otp.mocks.js";
const { verifyOTP } = await import("../../../src/shared/utils/otp.service.js");

export const verifyPayload = {
  otp: 123456,
  password: "NewPassword@456",
};

export const URL = endpoints.auth.forgotpassword.verify;

// Cast to jest.Mock so TypeScript allows .mockResolvedValueOnce
export const mockVerifyOTP = jest.mocked(verifyOTP) as jest.MockedFunction<
  typeof verifyOTP
>;

export const mockOtpData = {
  otp: "123456",
  otpType: "forgot" as const,
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
    type: overrides?.type ?? "forget",
  };
  const value = `j:${JSON.stringify(payload)}`;
  return `otp_data=${encodeURIComponent(value)}`;
}

// Seeds a user in DB so User.updateOne has a target to update
export async function seedUser(overrides?: { email?: string }) {
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