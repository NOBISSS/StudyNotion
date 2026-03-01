import { describe, expect, it } from "@jest/globals";
import "../otp.mocks.js";
const { default: app } = await import("../../../src/app.js");
const { buildOtpCookie } =
  await import("../signup-verify/signup-verification.fixtures.js");
const request = (await import("supertest")).default;
const { mockCanResendData, mockCanResendOTP, mockGetOTP, mockGetOTPData, URL } =
  await import("./resendotp.fixtures.js");

describe(`POST ${URL} → SUCCESS`, () => {
  it("should resend OTP successfully and return response contract", async () => {
    mockCanResendOTP.mockResolvedValue(mockCanResendData);
    mockGetOTP.mockResolvedValue(mockGetOTPData);
    const res = await request(app)
      .post(URL)
      .set("Cookie", buildOtpCookie())
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("OTP resent successfully");
    expect(res.body.data).toMatchObject({
      email: "arafat@test.com",
    });
  });

  it("should not expose password or passwordHash in response", async () => {
    const res = await request(app)
      .post(URL)
      .set("Cookie", buildOtpCookie())
      .send();

    const body = JSON.stringify(res.body);
    expect(body).not.toContain("password");
    expect(body).not.toContain("passwordHash");
  });
});
