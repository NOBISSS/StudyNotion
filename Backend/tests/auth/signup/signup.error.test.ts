import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { registerPayload, URL } from "./signup.fixtures.js";

// Dynamic import so mongoose model is available after DB connection in setup.ts
const getUser = async () =>
  (await import("../../../src/modules/user/UserModel.js")).default;

// Seeds a verified user into the DB directly — bypasses OTP flow
async function seedUser(overrides?: Partial<typeof registerPayload>) {
  const User = await getUser();
  return User.create({
    firstName: overrides?.firstName ?? registerPayload.firstName,
    lastName: overrides?.lastName ?? registerPayload.lastName,
    email: overrides?.email ?? registerPayload.email,
    // contactNo: overrides?.contactNo ?? registerPayload.contactNo,
    password: "hashed-password",
    accountType: "student",
    // status: "active",
    // emailVerified: true,
    isDeleted: false,
  });
}

describe(`POST ${URL} → ERRORS`, () => {
  it("should return 409 when email already exists", async () => {
    await seedUser();

    // Same email, different contactNo — AND query would miss this
    const res = await request(app)
      .post(URL)
      .send({ ...registerPayload });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });
});
