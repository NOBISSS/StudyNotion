import { describe, expect, it, jest } from "@jest/globals";
import { mockOtpData } from "./signup-verification.fixtures.js";
const { default: app } = await import("../../../src/app.js");
const { buildOtpCookie, verifyPayload, URL, mockVerifyOTP } = await import("./signup-verification.fixtures.js");
const request = (await import("supertest")).default;
describe(`POST ${URL} → ERRORS`, () => {
    it("should return 403 when OTP is invalid", async () => {
        mockVerifyOTP.mockResolvedValueOnce(null);
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toMatch(/invalid or expired/i);
    });
    it("should return 403 when OTP has expired", async () => {
        mockVerifyOTP.mockResolvedValueOnce(null);
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toMatch(/invalid or expired/i);
    });
    it("should return 403 when OTP type is not signup", async () => {
        mockVerifyOTP.mockResolvedValueOnce(null);
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie({ type: "login" }))
            .send(verifyPayload);
        expect(res.statusCode).toBe(403);
        expect(res.body.message).toMatch(/invalid or expired/i);
    });
    it("should return 400 when otp_data cookie email is missing", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie({ email: "" }))
            .send(verifyPayload);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid Request");
    });
});
//# sourceMappingURL=signup-verification.errors.test.js.map