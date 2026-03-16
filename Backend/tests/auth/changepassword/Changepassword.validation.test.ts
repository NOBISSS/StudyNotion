import { describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import {
  URL,
  changePasswordPayload,
} from "./changepassword.fixtures.js";
import { getAuthCookie } from "../../getAuthCookie.js";

describe(`put ${URL} → VALIDATION`, () => {
  it("should fail if oldPassword is missing", async () => {
    const { cookie } = await getAuthCookie();
    const { oldPassword: _old, ...withoutOld } = changePasswordPayload;

    const res = await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send(withoutOld);
    expect(res.statusCode).toBe(400);
  });

  it("should fail if newPassword is missing", async () => {
    const { cookie } = await getAuthCookie();
    const { newPassword: _new, ...withoutNew } = changePasswordPayload;

    const res = await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send(withoutNew);

    expect(res.statusCode).toBe(400);
  });

  it("should fail if newPassword is less than 8 characters", async () => {
    const { cookie } = await getAuthCookie();

    const res = await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send({ ...changePasswordPayload, newPassword: "P@1a" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "New Password length shouldn't be less than 8",
    );
  });

  it("should fail if newPassword has no uppercase", async () => {
    const { cookie } = await getAuthCookie();

    const res = await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send({ ...changePasswordPayload, newPassword: "newpassword@456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "New Password should include atlist 1 uppercase character",
    );
  });

  it("should fail if newPassword has no lowercase", async () => {
    const { cookie } = await getAuthCookie();

    const res = await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send({ ...changePasswordPayload, newPassword: "NEWPASSWORD@456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "New Password should include atlist 1 lowercase character",
    );
  });

  it("should fail if newPassword has no number", async () => {
    const { cookie } = await getAuthCookie();

    const res = await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send({ ...changePasswordPayload, newPassword: "NewPassword@abc" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "New Password should include atlist 1 number character",
    );
  });

  it("should fail if newPassword has no special character", async () => {
    const { cookie } = await getAuthCookie();

    const res = await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send({ ...changePasswordPayload, newPassword: "NewPassword456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "New Password should include atlist 1 special character",
    );
  });
});
