import { describe, expect, it, jest } from "@jest/globals";
import "../otp.mocks.js";
const { default: app } = await import("../../../src/app.js");
const { buildOtpCookie } = await import("../signup-verify/signup-verification.fixtures.js");
const request = (await import("supertest")).default;
const { mockCanResendData, mockCanResendOTP, mockGetOTP, mockGetOTPData, URL } = await import("./resendotp.fixtures.js");
const emailQueue = (await import("../../../src/shared/queue/emailQueue.js")).emailQueue;
describe(`POST ${URL} → QUEUE`, () => {
    it("should push send-otp job", async () => {
        mockCanResendOTP.mockResolvedValue(mockCanResendData);
        mockGetOTP.mockResolvedValue(mockGetOTPData);
        const spy = jest.spyOn(emailQueue, "add");
        await request(app).post(URL).set("Cookie", buildOtpCookie()).send();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("send-otp", expect.objectContaining({
            email: "arafat@test.com",
            otp: expect.stringMatching(/^\d{6}$/),
        }));
    });
});
//# sourceMappingURL=resendotp.queue.test.js.map