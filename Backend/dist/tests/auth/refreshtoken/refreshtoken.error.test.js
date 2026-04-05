import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { URL, getRefreshCookie } from "./refreshtoken.fixtures.js";
describe(`POST ${URL} → ERRORS`, () => {
    it("should return 401 when no refreshToken cookie is provided", async () => {
        const res = await request(app).post(URL);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/refresh token is required/i);
    });
    it("should return 401 when refreshToken is invalid", async () => {
        const res = await request(app)
            .post(URL)
            .set("Cookie", "refreshToken=invalid.token.value");
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/invalid refresh token/i);
    });
    it("should return 401 when refreshToken is malformed/expired", async () => {
        const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAxfQ.invalid";
        const res = await request(app)
            .post(URL)
            .set("Cookie", `refreshToken=${expiredToken}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/invalid refresh token/i);
    });
    it("should return 401 when user no longer exists in DB", async () => {
        const { refreshCookie, user } = await getRefreshCookie();
        const User = (await import("../../../src/modules/user/UserModel.js"))
            .default;
        await User.findByIdAndDelete(user._id);
        const res = await request(app).post(URL).set("Cookie", refreshCookie);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/invalid refresh token/i);
    });
});
//# sourceMappingURL=refreshtoken.error.test.js.map