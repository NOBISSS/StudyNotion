import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import { getAuthCookie } from "../../getAuthCookie.js";
import "../otp.mocks.js";
import { URL } from "./getuser.fixtures.js";
describe(`GET ${URL} → SUCCESS`, () => {
    it("should return 200 with correct response shape", async () => {
        const { cookie } = await getAuthCookie();
        const res = await request(app).get(URL).set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User fetched successfully");
        expect(res.body.data).toHaveProperty("user");
        expect(res.body.data).toHaveProperty("profile");
    });
    it("should return correct user data", async () => {
        const { cookie, user } = await getAuthCookie();
        const res = await request(app).get(URL).set("Cookie", cookie);
        expect(res.body.data.user.email).toBe(user.email);
        expect(res.body.data.user.firstName).toBe(user.firstName);
        expect(res.body.data.user.lastName).toBe(user.lastName);
    });
    it("should not expose password or refreshToken in response", async () => {
        const { cookie } = await getAuthCookie();
        const res = await request(app).get(URL).set("Cookie", cookie);
        const body = JSON.stringify(res.body);
        expect(body).not.toContain("password");
        expect(body).not.toContain("refreshToken");
    });
    it("should return null profile when no profile exists for user", async () => {
        const { cookie } = await getAuthCookie();
        const res = await request(app).get(URL).set("Cookie", cookie);
        expect(res.body.data.profile).toBeNull();
    });
    it("should return profile when profile exists for user", async () => {
        const { cookie, user } = await getAuthCookie();
        const { Profile } = await import("../../../src/modules/user/ProfileModel.js");
        await Profile.create({ userId: user._id, city: "Ahmedabad" });
        const res = await request(app).get(URL).set("Cookie", cookie);
        expect(res.body.data.profile).not.toBeNull();
        expect(res.body.data.profile.city).toBe("Ahmedabad");
    });
});
//# sourceMappingURL=getuser.success.test.js.map