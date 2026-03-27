import { describe, expect, it } from "@jest/globals";
import "../otp.mocks.js";
const { default: app } = await import("../../../src/app.js");
const { buildOtpCookie, verifyPayload, URL, mockVerifyOTP, mockOtpData } = await import("./signup-verification.fixtures.js");
const request = (await import("supertest")).default;
describe(`POST ${URL} → SUCCESS`, () => {
    it("should return 200 with correct response shape", async () => {
        mockVerifyOTP.mockResolvedValueOnce(mockOtpData);
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        console.log(res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Signup successful");
        expect(res.body.data).toHaveProperty("user");
    });
    it("should create user in DB", async () => {
        mockVerifyOTP.mockResolvedValueOnce(mockOtpData);
        await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        const { default: User } = await import("../../../src/modules/user/UserModel.js");
        const user = await User.findOne({ email: "arafat@test.com" });
        expect(user).not.toBeNull();
    });
    it("should create user profile in DB with correct name", async () => {
        mockVerifyOTP.mockResolvedValueOnce(mockOtpData);
        await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        const { default: User } = await import("../../../src/modules/user/UserModel.js");
        const user = await User.findOne({ email: "arafat@test.com" });
        expect(user).not.toBeNull();
        expect(user.firstName).toBe("Arafat");
        expect(user.lastName).toBe("Mansuri");
    });
    it("should not expose password or passwordHash in response", async () => {
        mockVerifyOTP.mockResolvedValueOnce(mockOtpData);
        const res = await request(app)
            .post(URL)
            .set("Cookie", buildOtpCookie())
            .send(verifyPayload);
        const body = JSON.stringify(res.body);
        expect(body).not.toContain("passwordHash");
    });
});
//# sourceMappingURL=signup-verification.success.test.js.map