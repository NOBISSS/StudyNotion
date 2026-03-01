import { describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import { getAuthCookie } from "../../getAuthCookie.js";
import "../otp.mocks.js";
import { URL, changePasswordPayload } from "./changepassword.fixtures.js";

describe(`put ${URL} → ERRORS`, () => {
  it("should return 401 when no accessToken cookie is provided", async () => {
    const res = await request(app).put(URL).send(changePasswordPayload);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });

  it("should return 400 when old password is incorrect", async () => {
    const { cookie } = await getAuthCookie();

    // bcrypt.compare is mocked to return true globally in otp.mocks.ts
    // override comparePassword result for this test via bcrypt.compareSync
    const bcrypt = (await import("bcrypt")).default;
    jest.spyOn(bcrypt, "compareSync").mockReturnValueOnce(false);

    const res = await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send(changePasswordPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/old password is incorrect/i);
  });
});
