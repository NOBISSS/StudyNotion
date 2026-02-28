import request from "supertest";
import app from "../../../src/app.js";
import { emailQueue } from "../../../src/shared/queue/emailQueue.js";
import "./signup.mocks.js";
import { describe, it, jest, expect } from "@jest/globals";
import { registerPayload,URL } from "./signup.fixtures.js";

describe("POST /api/auth/signup → QUEUE", () => {
  it("should push send-otp job", async () => {
    const spy = jest.spyOn(emailQueue, "add");

    await request(app).post(URL).send(registerPayload);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      "send-otp",
      expect.objectContaining({
        email: registerPayload.email,
        otp: expect.stringMatching(/^\d{6}$/),
      }),
    );
  });
});
