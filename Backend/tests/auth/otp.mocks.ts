import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import redis from "../../src/shared/config/redis.js";
import { emailQueue } from "../../src/shared/queue/emailQueue.js";

jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password" as never);
jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

jest.spyOn(redis, "pipeline").mockReturnValue({
  set: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([null,"OK"] as never),
  ttl: jest.fn().mockResolvedValue(300 as never),
} as never);

jest.spyOn(emailQueue, "add").mockResolvedValue({
  email: "queue@test.com",
  otp: "123456",
} as never);
// ES module named exports are read-only — jest.spyOn cannot reassign them.
// jest.mock() hoists before imports and replaces the entire module,
// which is the only reliable way to mock standalone exported functions.
jest.unstable_mockModule("../../src/shared/utils/otp.service.js", () => ({
  verifyOTP: jest.fn().mockResolvedValue(null as never),
  saveOTP: jest.fn().mockResolvedValue(undefined as never),
  generateOTP: jest.fn().mockReturnValue("123456"),
  getOTPData: jest.fn().mockResolvedValue(null as never),
  canResendOTP: jest.fn().mockResolvedValue(true as never),
  deleteOTP: jest.fn().mockResolvedValue(undefined as never),
}));