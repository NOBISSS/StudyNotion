import { describe, expect, it } from "@jest/globals";
import "../otp.mocks.js";
const { default: app } = await import("../../../src/app.js");
const { buildOtpCookie, verifyPayload, URL } = await import("./forgotpassword-verification.fixtures.js");
const request = (await import("supertest")).default;
describe(`POST ${URL} → VALIDATION`, () => {
    it("should fail if otp is missing", async () => {
        const { otp: _otp, ...withoutOtp } = verifyPayload;
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(withoutOtp);
        expect(res.statusCode).toBe(400);
    });
    it("should fail if password is missing", async () => {
        const { password: _password, ...withoutPassword } = verifyPayload;
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(withoutPassword);
        expect(res.statusCode).toBe(400);
    });
    it("should fail if password has no uppercase", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send({ ...verifyPayload, password: "newpassword@456" });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password should include atlist 1 uppercase character");
    });
    it("should fail if password has no lowercase", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send({ ...verifyPayload, password: "NEWPASSWORD@456" });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password should include atlist 1 lowercase character");
    });
    it("should fail if password has no number", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send({ ...verifyPayload, password: "NewPassword@abc" });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password should include atlist 1 number character");
    });
    it("should fail if password has no special character", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send({ ...verifyPayload, password: "NewPassword456" });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password should include atlist 1 special character");
    });
    it("should fail if password is less than 8 characters", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send({ ...verifyPayload, password: "N@1a" });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password length shouldn't be less than 8");
    });
});
//# sourceMappingURL=forgotpassword-verification.validation.test.js.map