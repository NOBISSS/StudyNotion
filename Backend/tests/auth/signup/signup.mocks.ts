import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import redis from "../../../src/shared/config/redis.js";
import { emailQueue } from "../../../src/shared/queue/emailQueue.js";

jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password" as never);

jest.spyOn(redis, "pipeline").mockReturnValue({
  setex: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([null,"OK"] as never),
} as never);

jest.spyOn(emailQueue, "add").mockResolvedValue({
  email: "queue@test.com",
  otp: "123456",
} as never);
