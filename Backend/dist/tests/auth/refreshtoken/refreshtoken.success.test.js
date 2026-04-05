import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { URL, getRefreshCookie } from "./refreshtoken.fixtures.js";
describe(`POST ${URL} → SUCCESS`, () => {
    it("should return 200 with correct response shape", async () => {
        const { refreshCookie } = await getRefreshCookie();
        const res = await request(app).post(URL).set("Cookie", refreshCookie);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Access token refreshed successfully");
        expect(res.body.data).toHaveProperty("accessToken");
    });
    it("should return a non-empty accessToken string", async () => {
        const { refreshCookie } = await getRefreshCookie();
        const res = await request(app).post(URL).set("Cookie", refreshCookie);
        expect(typeof res.body.data.accessToken).toBe("string");
        expect(res.body.data.accessToken.length).toBeGreaterThan(0);
    });
    it("should set a new accessToken cookie", async () => {
        const { refreshCookie } = await getRefreshCookie();
        const res = await request(app).post(URL).set("Cookie", refreshCookie);
        const cookies = res.headers["set-cookie"];
        const accessTokenCookie = cookies?.find((c) => c.startsWith("accessToken="));
        expect(accessTokenCookie).toBeDefined();
    });
    it("should set accessToken cookie with HttpOnly and Secure flags", async () => {
        const { refreshCookie } = await getRefreshCookie();
        const res = await request(app).post(URL).set("Cookie", refreshCookie);
        const cookies = res.headers["set-cookie"];
        const accessTokenCookie = cookies?.find((c) => c.startsWith("accessToken="));
        expect(accessTokenCookie).toMatch(/HttpOnly/i);
        expect(accessTokenCookie).toMatch(/Secure/i);
    });
    it("should not set a new refreshToken cookie", async () => {
        const { refreshCookie } = await getRefreshCookie();
        const res = await request(app).post(URL).set("Cookie", refreshCookie);
        const cookies = res.headers["set-cookie"] ?? [];
        const hasRefreshCookie = cookies.some((c) => c.startsWith("refreshToken="));
        expect(hasRefreshCookie).toBe(false);
    });
});
//# sourceMappingURL=refreshtoken.success.test.js.map