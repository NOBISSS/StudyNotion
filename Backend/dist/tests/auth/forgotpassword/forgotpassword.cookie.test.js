import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { URL, forgotPasswordPayload, seedUser, } from "./forgotpassword.fixtures.js";
describe(`POST ${URL} → COOKIES`, () => {
    it("should set the otp_data cookie", async () => {
        await seedUser();
        const res = await request(app).post(URL).send(forgotPasswordPayload);
        const cookies = res.headers["set-cookie"];
        const otpCookie = cookies?.find((c) => c.startsWith("otp_data="));
        expect(otpCookie).toBeDefined();
    });
    it("should set otp_data cookie with HttpOnly and Secure flags", async () => {
        await seedUser();
        const res = await request(app).post(URL).send(forgotPasswordPayload);
        const cookies = res.headers["set-cookie"];
        const otpCookie = cookies?.find((c) => c.startsWith("otp_data="));
        expect(otpCookie).toMatch(/HttpOnly/i);
        expect(otpCookie).toMatch(/Secure/i);
        expect(otpCookie).toMatch(/SameSite=None/i);
    });
    it("should set otp_data cookie with correct payload", async () => {
        await seedUser();
        const res = await request(app).post(URL).send(forgotPasswordPayload);
        const cookies = res.headers["set-cookie"];
        const otpCookie = cookies?.find((c) => c.startsWith("otp_data="));
        const raw = otpCookie.split(";")[0].replace("otp_data=", "");
        const decoded = decodeURIComponent(raw);
        const jsonStr = decoded.startsWith("j:") ? decoded.slice(2) : decoded;
        const parsed = JSON.parse(jsonStr);
        expect(parsed).toMatchObject({
            email: forgotPasswordPayload.email,
            type: "forgot",
        });
    });
    it("should not set accessToken or refreshToken cookies", async () => {
        await seedUser();
        const res = await request(app).post(URL).send(forgotPasswordPayload);
        const cookies = res.headers["set-cookie"] ?? [];
        expect(cookies.some((c) => c.startsWith("accessToken="))).toBe(false);
        expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(false);
    });
});
//# sourceMappingURL=forgotpassword.cookie.test.js.map