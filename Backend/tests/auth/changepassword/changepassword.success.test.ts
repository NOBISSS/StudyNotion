import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { URL, changePasswordPayload } from "./changepassword.fixtures.js";
import { getAuthCookie } from "../../getAuthCookie.js";

describe(`put ${URL} → SUCCESS`, () => {
  it("should return 200 with correct response shape", async () => {
    const { cookie } = await getAuthCookie();

    const res = await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send(changePasswordPayload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Password changed successfully");
    expect(res.body.data).toHaveProperty("user");
  });

  it("should not expose password or refreshToken in response", async () => {
    const { cookie } = await getAuthCookie();

    const res = await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send(changePasswordPayload);

    const body = JSON.stringify(res.body);
    expect(body).not.toContain("password");
    expect(body).not.toContain("refreshToken");
  });

  it("should actually update the password in DB", async () => {
    const { cookie, user } = await getAuthCookie();

    await request(app)
      .put(URL)
      .set("Cookie", cookie)
      .send(changePasswordPayload);

    const User = (await import("../../../src/modules/user/UserModel.js")).default;
    const updatedUser = await User.findById(user._id);

    // Password field should have changed from the original hashed-password
    expect(updatedUser!.password).not.toBe("hashed-password");
  });
});