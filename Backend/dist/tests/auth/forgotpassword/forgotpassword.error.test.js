import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { URL } from "./forgotpassword.fixtures.js";
describe(`POST ${URL} → ERRORS`, () => {
    it("should return 404 when user does not exist", async () => {
        const res = await request(app)
            .post(URL)
            .send({ email: "nonexistent@test.com" });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/user not found/i);
    });
});
//# sourceMappingURL=forgotpassword.error.test.js.map