import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { URL } from "./forgotpassword.fixtures.js";
describe(`POST ${URL} → VALIDATION`, () => {
    it("should fail if email is missing", async () => {
        const res = await request(app).post(URL).send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Email is required");
    });
    it("should fail if email is invalid", async () => {
        const res = await request(app).post(URL).send({ email: "not-an-email" });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid email address");
    });
    it("should fail if email is empty string", async () => {
        const res = await request(app).post(URL).send({ email: "" });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid email address");
    });
});
//# sourceMappingURL=forgotpassword.validation.test.js.map