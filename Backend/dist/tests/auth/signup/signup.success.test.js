import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { registerPayload, URL } from "./signup.fixtures.js";
describe("POST /api/auth/signup → SUCCESS", () => {
    it("should send OTP successfully and return response contract", async () => {
        const res = await request(app).post(URL).send(registerPayload);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("OTP sent successfully");
        expect(res.body.data).toMatchObject({
            email: registerPayload.email,
        });
    });
    it("should transform email to lowercase", async () => {
        const res = await request(app)
            .post(URL)
            .send({ ...registerPayload, email: "ARAFAT@TEST.COM" });
        expect(res.statusCode).toBe(200);
        expect(res.body.data.email).toBe("arafat@test.com");
    });
    it("should not expose password or passwordHash in response", async () => {
        const res = await request(app).post(URL).send(registerPayload);
        const body = JSON.stringify(res.body);
        expect(body).not.toContain("password");
        expect(body).not.toContain("passwordHash");
    });
});
//# sourceMappingURL=signup.success.test.js.map