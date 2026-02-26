import request from "supertest";
import app from "../../../src/app.js";
import "./signup.mocks.js";
import { describe, it, expect } from "@jest/globals";

describe("POST /api/auth/signup → COOKIE", () => {
  it("should set otp_data cookie", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      firstName: "Test",
      lastName: "User",
      email: "cookie@test.com",
      password: "Password@123",
      accountType: "student",
    });

    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
