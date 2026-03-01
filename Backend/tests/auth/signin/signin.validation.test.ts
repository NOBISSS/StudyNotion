import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { signinPayload, URL } from "./signin.fixtures.js";

describe(`POST ${URL} → VALIDATION`, () => {
  it("should fail if email is missing", async () => {
    const { email: _email, ...withoutEmail } = signinPayload;

    const res = await request(app).post(URL).send(withoutEmail);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email is required");
  });

  it("should fail if password is missing", async () => {
    const { password: _password, ...withoutPassword } = signinPayload;

    const res = await request(app).post(URL).send(withoutPassword);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Password is required");
  });

  it("should fail if email is invalid", async () => {
    const res = await request(app)
      .post(URL)
      .send({ ...signinPayload, email: "not-an-email" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid email address");
  });

  it("should fail if body is empty", async () => {
    const res = await request(app).post(URL).send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email is required");
  });
});
