import request from "supertest";
import app from "../../../src/app.js";
import { emailQueue } from "../../../src/shared/queue/emailQueue.js";
import "./signup.mocks.js";
import { describe, it, jest, expect } from "@jest/globals";

describe("POST /api/auth/signup → QUEUE", () => {
  it("should push send-otp job", async () => {
    const spy = jest.spyOn(emailQueue, "add");

    await request(app).post("/api/auth/signup").send({
      firstName: "Test",
      lastName: "User",
      email: "queue@test.com",
      password: "Password@123",
      accountType: "student",
    });

    expect(spy).toHaveBeenCalledWith(
      "send-otp",
      expect.objectContaining({
        email: "queue@test.com",
        otp: "211110",
      }),
    );
  });
});
