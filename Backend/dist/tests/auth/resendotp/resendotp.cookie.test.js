import { describe, expect, it } from "@jest/globals";
import "../otp.mocks.js";
const { default: app } = await import("../../../src/app.js");
const { buildOtpCookie } = await import("../signup-verify/signup-verification.fixtures.js");
const request = (await import("supertest")).default;
const { mockCanResendData, mockCanResendOTP, mockGetOTP, mockGetOTPData, URL } = await import("./resendotp.fixtures.js");
describe(`POST ${URL} → COOKIE`, () => {
    it("should set the otp_data cookie", async () => {
        mockCanResendOTP.mockResolvedValue(mockCanResendData);
        mockGetOTP.mockResolvedValue(mockGetOTPData);
        const res = await request(app).post(URL).set("Cookie", buildOtpCookie()).send();
        const cookies = res.headers["set-cookie"];
        console.log("Set-Cookie Headers:", cookies);
        const otpCookie = cookies?.find((c) => c.startsWith("otp_data="));
        expect(otpCookie).toBeDefined();
    });
    it("should set otp_data cookie with HttpOnly and Secure flags", async () => {
        mockCanResendOTP.mockResolvedValue(mockCanResendData);
        mockGetOTP.mockResolvedValue(mockGetOTPData);
        const res = await request(app).post(URL).set("Cookie", buildOtpCookie()).send();
        const cookies = res.headers["set-cookie"];
        const otpCookie = cookies?.find((c) => c.startsWith("otp_data="));
        expect(otpCookie).toMatch(/HttpOnly/i);
        expect(otpCookie).toMatch(/Secure/i);
        expect(otpCookie).toMatch(/SameSite=None/i);
    });
    it("should set otp_data cookie with correct payload", async () => {
        mockCanResendOTP.mockResolvedValue(mockCanResendData);
        mockGetOTP.mockResolvedValue(mockGetOTPData);
        const res = await request(app).post(URL).set("Cookie", buildOtpCookie()).send();
        const cookies = res.headers["set-cookie"];
        const otpCookie = cookies?.find((c) => c.startsWith("otp_data="));
        const raw = otpCookie.split(";")[0].replace("otp_data=", "");
        const decoded = decodeURIComponent(raw);
        const jsonStr = decoded.startsWith("j:") ? decoded.slice(2) : decoded;
        const parsed = JSON.parse(jsonStr);
        expect(parsed).toMatchObject({
            email: "arafat@test.com",
            type: "signup",
        });
    });
});
//# sourceMappingURL=resendotp.cookie.test.js.map