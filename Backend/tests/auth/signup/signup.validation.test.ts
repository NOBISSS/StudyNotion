import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "./signup.mocks.js";
import dotenv from 'dotenv';
import { registerPayload,URL } from "./signup.fixtures.js";
dotenv.config();

describe("POST /api/auth/signup → VALIDATION", () => {
  it("should fail if firstName < 3", async () => {
    const res = await request(app).post(URL).send({...registerPayload, firstName: "Ar"});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("First name must be atleast 3 characters");
  });

  it("should fail if lastName < 3", async () => {
    const res = await request(app).post(URL).send({...registerPayload, lastName: "Ma"});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Last name must be atleast 3 characters");
  });

  it("should fail if email invalid", async () => {
    const res = await request(app).post(URL).send({...registerPayload, email: "invalid-email"});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid email address");
  });

  it("should fail if password has no uppercase", async () => {
    const res = await request(app).post(URL).send({...registerPayload, password: "password@123"});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Password should include atlist 1 uppercase character",
    );
  });

  it("should fail if password has no lowercase", async () => {
    const res = await request(app).post(URL).send({...registerPayload, password: "PASSWORD@123"});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Password should include atlist 1 lowercase character",
    );
  });

  it("should fail if password has no number", async () => {
    const res = await request(app).post(URL).send({...registerPayload, password: "Password@abc"});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Password should include atlist 1 number character",
    );
  });

  it("should fail if password has no special character", async () => {
    const res = await request(app).post(URL).send({...registerPayload, password: "Password123"});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Password should include atlist 1 special character",
    );
  });

  it("should fail if password < 8 chars", async () => {
    const res = await request(app).post(URL).send({...registerPayload, password: "P@1a"});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Password length shouldn't be less than 8");
  });
});
