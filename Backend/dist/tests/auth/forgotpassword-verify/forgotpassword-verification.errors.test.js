import { describe, expect, it } from "@jest/globals";
import "../otp.mocks.js";
const { default: app } = await import("../../../src/app.js");
const { buildOtpCookie, verifyPayload, URL, mockVerifyOTP, mockOtpData, seedUser, } = await import("./forgotpassword-verification.fixtures.js");
const request = (await import("supertest")).default;
describe(`POST ${URL} → ERRORS`, () => {
    it("should return 400 when otp_data cookie is missing", async () => {
        const res = await request(app).post(URL).send(verifyPayload);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid Request");
    });
    it("should return 400 when otp_data cookie email is missing", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie({ email: "" }))
            .send(verifyPayload);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid Request");
    });
    it("should return 400 when OTP is invalid or expired", async () => {
        await seedUser();
        mockVerifyOTP.mockResolvedValueOnce(null);
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/invalid otp/i);
    });
    it("should return 400 when otpType does not match forgot", async () => {
        await seedUser();
        mockVerifyOTP.mockResolvedValueOnce({
            ...mockOtpData,
            otpType: "registration",
        });
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/invalid otp/i);
    });
});
//# sourceMappingURL=forgotpassword-verification.errors.test.js.map