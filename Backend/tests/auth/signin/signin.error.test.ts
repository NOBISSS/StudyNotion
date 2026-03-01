import { describe, expect, it,jest } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { signinPayload, URL, seedUser } from "./signin.fixtures.js";

describe(`POST ${URL} → ERRORS`, () => {
  it("should return 404 when user does not exist", async () => {
    await seedUser(); // Seed a user to ensure DB is connected, but use a different email for the test
    const res = await request(app)
      .post(URL)
      .send({ ...signinPayload, email: "nonexistent@test.com" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/user not found/i);
  });

  it("should return 400 when password is incorrect", async () => {
    await seedUser();

    const bcrypt = (await import("bcrypt")).default;
    jest.spyOn(bcrypt, "compareSync").mockReturnValueOnce(false);

    const res = await request(app)
      .post(URL)
      .send({ ...signinPayload, password: "WrongPassword@1" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid password/i);
  });

  it("should return 401 when user is banned", async () => {
    const { default: User } = await import(
      "../../../src/modules/user/UserModel.js"
    );
    await User.create({
      firstName: "Arafat",
      lastName: "Mansuri",
      email: "banned@test.com",
      password: "hashed-password",
      accountType: "student",
      isBanned: true,
      isDeleted: false,
    });

    const res = await request(app)
      .post(URL)
      .send({ ...signinPayload, email: "banned@test.com" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/banned/i);
  });

  it("should return 401 when user is deleted", async () => {
    const { default: User } = await import(
      "../../../src/modules/user/UserModel.js"
    );
    await User.create({
      firstName: "Arafat",
      lastName: "Mansuri",
      email: "deleted@test.com",
      password: "hashed-password",
      accountType: "student",
      isBanned: false,
      isDeleted: true,
    });

    const res = await request(app)
      .post(URL)
      .send({ ...signinPayload, email: "deleted@test.com" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
