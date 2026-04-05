import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { URL } from "./getuser.fixtures.js";
describe(`GET ${URL} → ERRORS`, () => {
    it("should return 401 when no accessToken cookie is provided", async () => {
        const res = await request(app).get(URL);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/unauthorized/i);
    });
    it("should return 401 when accessToken is invalid", async () => {
        const res = await request(app)
            .get(URL)
            .set("Cookie", "accessToken=invalid.token.value");
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/unauthorized/i);
    });
    it("should return 401 when accessToken is expired or malformed", async () => {
        const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAxfQ.invalid";
        const res = await request(app)
            .get(URL)
            .set("Cookie", `accessToken=${expiredToken}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/unauthorized/i);
    });
});
//# sourceMappingURL=getuser.error.test.js.map