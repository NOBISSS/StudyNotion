import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { registerPayload, URL } from "./signup.fixtures.js";
const getUser = async () => (await import("../../../src/modules/user/UserModel.js")).default;
async function seedUser(overrides) {
    const User = await getUser();
    return User.create({
        firstName: overrides?.firstName ?? registerPayload.firstName,
        lastName: overrides?.lastName ?? registerPayload.lastName,
        email: overrides?.email ?? registerPayload.email,
        password: "hashed-password",
        accountType: "student",
        isDeleted: false,
    });
}
describe(`POST ${URL} → ERRORS`, () => {
    it("should return 409 when email already exists", async () => {
        await seedUser();
        const res = await request(app)
            .post(URL)
            .send({ ...registerPayload });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toMatch(/already exists/i);
    });
});
//# sourceMappingURL=signup.error.test.js.map