import { describe, expect, it } from "@jest/globals";
import { buildOtpCookie } from "../signup-verify/signup-verification.fixtures.js";
const { default: app } = await import("../../../src/app.js");
const { URL, mockCanResendOTP, mockGetOTP } = await import("./resendotp.fixtures.js");
const request = (await import("supertest")).default;
describe(`POST ${URL} → ERRORS`, () => {
    it("should return 429 when OTP cannot be resent", async () => {
        mockCanResendOTP.mockResolvedValueOnce(false);
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send();
        expect(res.statusCode).toBe(429);
        expect(res.body.message).toMatch(/limit reached/i);
    });
    it("should return 403 when OTP has expired", async () => {
        mockCanResendOTP.mockResolvedValueOnce(true);
        mockGetOTP.mockResolvedValueOnce(null);
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send();
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toMatch(/invalid/i);
    });
    it("should return 400 when otp_data cookie email is missing", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie({ email: "" }))
            .send();
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid Request");
    });
});
//# sourceMappingURL=resendotp.errors.test.js.map