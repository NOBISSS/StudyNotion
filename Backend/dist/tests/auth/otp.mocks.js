import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import redis from "../../src/shared/config/redis.js";
import { emailQueue } from "../../src/shared/queue/emailQueue.js";
jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password");
jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
jest.spyOn(bcrypt, "compareSync").mockResolvedValue(true);
jest.spyOn(redis, "pipeline").mockReturnValue({
    set: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    del: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([null, "OK"]),
    ttl: jest.fn().mockResolvedValue(300),
});
jest.spyOn(emailQueue, "add").mockResolvedValue({
    email: "queue@test.com",
    otp: "123456",
});
jest.unstable_mockModule("../../src/shared/utils/otp.service.js", () => ({
    verifyOTP: jest.fn().mockResolvedValue(null),
    saveOTP: jest.fn().mockResolvedValue(undefined),
    generateOTP: jest.fn().mockReturnValue("123456"),
    getOTPData: jest.fn().mockResolvedValue(null),
    canResendOTP: jest.fn().mockResolvedValue(true),
    deleteOTP: jest.fn().mockResolvedValue(undefined),
}));
//# sourceMappingURL=otp.mocks.js.map