import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import {
  URL,
  forgotPasswordPayload,
  seedUser,
} from "./forgotpassword.fixtures.js";

describe(`POST ${URL} → SUCCESS`, () => {
  it("should return 200 with correct response shape", async () => {
    await seedUser();

    const res = await request(app).post(URL).send(forgotPasswordPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("OTP sent successfully");
    expect(res.body.data).toMatchObject({ email: forgotPasswordPayload.email });
  });

  it("should not expose any sensitive data in response", async () => {
    await seedUser();

    const res = await request(app).post(URL).send(forgotPasswordPayload);

    const body = JSON.stringify(res.body);
    expect(body).not.toContain("password");
    expect(body).not.toContain("otp");
  });

  it("should transform email to lowercase", async () => {
    await seedUser();

    const res = await request(app).post(URL).send({ email: "ARAFAT@TEST.COM" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe("arafat@test.com");
  });
});
