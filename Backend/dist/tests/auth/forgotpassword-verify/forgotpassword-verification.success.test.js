import { describe, expect, it } from "@jest/globals";
import "../otp.mocks.js";
const { default: app } = await import("../../../src/app.js");
const { buildOtpCookie, verifyPayload, URL, mockVerifyOTP, mockOtpData, seedUser, } = await import("./forgotpassword-verification.fixtures.js");
const request = (await import("supertest")).default;
describe(`POST ${URL} → SUCCESS`, () => {
    it("should return 200 with correct response shape", async () => {
        await seedUser();
        mockVerifyOTP.mockResolvedValueOnce(mockOtpData);
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Password reset successfully, Please signin with new password");
        expect(res.body.data).toEqual({});
    });
    it("should update the user password in DB", async () => {
        const user = await seedUser();
        mockVerifyOTP.mockResolvedValueOnce(mockOtpData);
        await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        const { default: User } = await import("../../../src/modules/user/UserModel.js");
        const updatedUser = await User.findById(user._id);
        expect(updatedUser.password).not.toBe("hashed-password");
    });
    it("should not set any auth cookies on success", async () => {
        await seedUser();
        mockVerifyOTP.mockResolvedValueOnce(mockOtpData);
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        const cookies = res.headers["set-cookie"] ?? [];
        expect(cookies.some((c) => c.startsWith("accessToken="))).toBe(false);
        expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(false);
    });
});
//# sourceMappingURL=forgotpassword-verification.success.test.js.map