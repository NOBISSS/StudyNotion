import { describe, expect, it } from "@jest/globals";
const { default: app } = await import("../../../src/app.js");
const { buildOtpCookie, verifyPayload, URL } = await import("./signup-verification.fixtures.js");
const request = (await import("supertest")).default;
describe(`POST ${URL} → VALIDATION`, () => {
    it("should return 400 if OTP is missing", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("OTP is required");
    });
    it("should return 400 if OTP is empty string", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send({ OTP: "" });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("OTP is required");
    });
    it("should return 400 if otp_data cookie is missing", async () => {
        const res = await request(app).post(URL).send(verifyPayload);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid Request");
    });
});
//# sourceMappingURL=signup-verification.validation.test.js.map