import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { endpoints } from "../../../src/endpoints.js";
import { getAuthCookie } from "../../getAuthCookie.js";

const URL = endpoints.auth.logout.base;

describe(`POST ${URL} → SUCCESS`, () => {
    it("should return 200 with correct response shape", async () => {
    const { cookie } = await getAuthCookie();
    const res = await request(app).post(URL).set("Cookie", cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Signout successful");
  });

  it("should clear accessToken cookie", async () => {
    const { cookie } = await getAuthCookie();
    const res = await request(app).post(URL).set("Cookie", cookie);

    const cookies: string[] = res.headers["set-cookie"] as unknown as string[];
    const accessTokenCookie = cookies?.find((c) =>
      c.startsWith("accessToken="),
    )!;

    expect(accessTokenCookie).toBeDefined();
    // Cleared cookies have an empty value
    expect(accessTokenCookie).toMatch(/accessToken=;|accessToken=$/);
  });

  it("should clear refreshToken cookie", async () => {
    const { cookie } = await getAuthCookie();
    const res = await request(app).post(URL).set("Cookie", cookie);

    const cookies: string[] = res.headers["set-cookie"] as unknown as string[];
    const refreshTokenCookie = cookies?.find((c) =>
      c.startsWith("refreshToken="),
    )!;

    expect(refreshTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toMatch(/refreshToken=;|refreshToken=$/);
  });

  it("should set both cleared cookies with HttpOnly and Secure flags", async () => {
    const { cookie } = await getAuthCookie();
    const res = await request(app).post(URL).set("Cookie", cookie);

    const cookies: string[] = res.headers["set-cookie"] as unknown as string[];
    const accessTokenCookie = cookies?.find((c) =>
      c.startsWith("accessToken="),
    )!;
    const refreshTokenCookie = cookies?.find((c) =>
      c.startsWith("refreshToken="),
    )!;

    expect(accessTokenCookie).toMatch(/HttpOnly/i);
    expect(accessTokenCookie).toMatch(/Secure/i);
    expect(refreshTokenCookie).toMatch(/HttpOnly/i);
    expect(refreshTokenCookie).toMatch(/Secure/i);
  });

  it("should return empty data object", async () => {
    const { cookie } = await getAuthCookie();
    const res = await request(app).post(URL).set("Cookie", cookie);

    expect(res.body.data).toEqual({});
  });
});
