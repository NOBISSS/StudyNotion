import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../../../src/app.js";
import "./signup.mocks.js";

describe("POST /api/auth/signup → SUCCESS", () => {
  it("should send OTP successfully and return response contract", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      firstName: "Arafat",
      lastName: "Mansuri",
      email: "success@test.com",
      password: "Password@123",
      accountType: "student",
    });

    expect(res.statusCode).toBe(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("OTP sent successfully");

    expect(res.body.data.email).toBe("success@test.com");
  });
});
