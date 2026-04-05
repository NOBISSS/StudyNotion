import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { signinPayload, URL, seedUser } from "./signin.fixtures.js";
describe(`POST ${URL} → COOKIES`, () => {
    it("should set accessToken cookie on successful signin", async () => {
        await seedUser();
        const res = await request(app).post(URL).send(signinPayload);
        const cookies = res.headers["set-cookie"];
        const accessTokenCookie = cookies?.find((c) => c.startsWith("accessToken="));
        expect(accessTokenCookie).toBeDefined();
    });
    it("should set refreshToken cookie on successful signin", async () => {
        await seedUser();
        const res = await request(app).post(URL).send(signinPayload);
        const cookies = res.headers["set-cookie"];
        const refreshTokenCookie = cookies?.find((c) => c.startsWith("refreshToken="));
        expect(refreshTokenCookie).toBeDefined();
    });
    it("should set accessToken cookie with HttpOnly and Secure flags", async () => {
        await seedUser();
        const res = await request(app).post(URL).send(signinPayload);
        const cookies = res.headers["set-cookie"];
        const accessTokenCookie = cookies?.find((c) => c.startsWith("accessToken="));
        expect(accessTokenCookie).toMatch(/HttpOnly/i);
        expect(accessTokenCookie).toMatch(/Secure/i);
    });
    it("should set refreshToken cookie with HttpOnly and Secure flags", async () => {
        await seedUser();
        const res = await request(app).post(URL).send(signinPayload);
        const cookies = res.headers["set-cookie"];
        const refreshTokenCookie = cookies?.find((c) => c.startsWith("refreshToken="));
        expect(refreshTokenCookie).toMatch(/HttpOnly/i);
        expect(refreshTokenCookie).toMatch(/Secure/i);
    });
    it("should not set otp_data cookie on signin", async () => {
        await seedUser();
        const res = await request(app).post(URL).send(signinPayload);
        const cookies = res.headers["set-cookie"] ?? [];
        const hasOtpCookie = cookies.some((c) => c.startsWith("otp_data="));
        expect(hasOtpCookie).toBe(false);
    });
});
//# sourceMappingURL=signin.cookie.test.js.map