import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { signinPayload, URL, seedUser } from "./signin.fixtures.js";

describe(`POST ${URL} → SUCCESS`, () => {
  it("should return 200 with correct response shape", async () => {
    await seedUser();

    const res = await request(app).post(URL).send(signinPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Signin successful");
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("refreshToken");
  });

  it("should not expose password in response", async () => {
    await seedUser();

    const res = await request(app).post(URL).send(signinPayload);

    const body = JSON.stringify(res.body);
    expect(body).not.toContain("passwordHash");
    expect(res.body.data.user).not.toHaveProperty("password");
  });

  it("should return user with correct email", async () => {
    await seedUser();

    const res = await request(app).post(URL).send(signinPayload);

    expect(res.body.data.user.email).toBe(signinPayload.email);
  });
});
