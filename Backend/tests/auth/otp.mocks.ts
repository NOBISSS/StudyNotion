import { jest } from "@jest/globals";

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