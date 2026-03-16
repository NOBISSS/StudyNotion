import { describe, expect, it } from "@jest/globals";
import "../otp.mocks.js";
const { default: app } = await import("../../../src/app.js");
const { buildOtpCookie, verifyPayload, URL, mockVerifyOTP, mockOtpData } =
  await import("./signup-verification.fixtures.js");
const request = (await import("supertest")).default;

describe(`POST ${URL} → COOKIE`, () => {
  it("should set accessToken and refreshToken cookies", async () => {
    mockVerifyOTP.mockResolvedValueOnce(mockOtpData);

    const res = await request(app)
      .post(URL)
      .set("Cookie", buildOtpCookie())
      .send(verifyPayload);

    const cookies: string[] = res.headers["set-cookie"] as unknown as string[];
    const hasAccessToken = cookies
      ? cookies.some((c) => c.startsWith("accessToken="))
      : false;
    const hasRefreshToken = cookies
      ? cookies.some((c) => c.startsWith("refreshToken="))
      : false;

    expect(hasAccessToken).toBe(true);
    expect(hasRefreshToken).toBe(true);
  });
});
