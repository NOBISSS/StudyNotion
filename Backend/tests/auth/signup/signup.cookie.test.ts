import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import { registerPayload, URL } from "./signup.fixtures.js";
import "../otp.mocks.js";

describe(`POST ${URL} → COOKIE`, () => {
  it("should set the otp_data cookie", async () => {
    const res = await request(app).post(URL).send(registerPayload);

    const cookies: string[] = res.headers["set-cookie"] as unknown as string[];
    console.log("Set-Cookie Headers:", cookies);
    const otpCookie = cookies?.find((c) => c.startsWith("otp_data="));
    expect(otpCookie).toBeDefined();
  });

  it("should set otp_data cookie with HttpOnly and Secure flags", async () => {
    const res = await request(app).post(URL).send(registerPayload);

    const cookies: string[] = res.headers["set-cookie"] as unknown as string[];
    const otpCookie = cookies?.find((c) => c.startsWith("otp_data="))!;

    expect(otpCookie).toMatch(/HttpOnly/i);
    expect(otpCookie).toMatch(/Secure/i);
    expect(otpCookie).toMatch(/SameSite=None/i);
  });

  it("should set otp_data cookie with correct payload", async () => {
    const res = await request(app).post(URL).send(registerPayload);

    const cookies: string[] = res.headers["set-cookie"] as unknown as string[];
    const otpCookie = cookies?.find((c) => c.startsWith("otp_data="))!;

    // Extract value before first semicolon, decode it
    const raw = otpCookie.split(";")[0]!.replace("otp_data=", "");
    const decoded = decodeURIComponent(raw); // "j:{"email":"arafat@test.com"...}"
    const jsonStr = decoded.startsWith("j:") ? decoded.slice(2) : decoded;
    const parsed = JSON.parse(jsonStr);

    expect(parsed).toMatchObject({
      email: registerPayload.email,
      type: "signup",
    });
  });

  it("should not set accessToken or refreshToken cookies on register", async () => {
    const res = await request(app).post(URL).send(registerPayload);

    const cookies: string[] =
      (res.headers["set-cookie"] as unknown as string[]) ?? [];
    const hasAccessToken = cookies.some((c) => c.startsWith("accessToken="));
    const hasRefreshToken = cookies.some((c) => c.startsWith("refreshToken="));

    expect(hasAccessToken).toBe(false);
    expect(hasRefreshToken).toBe(false);
  });
});
