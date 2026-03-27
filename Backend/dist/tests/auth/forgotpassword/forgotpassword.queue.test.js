import { describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app.js";
import "../otp.mocks.js";
import { URL, forgotPasswordPayload, seedUser } from "./forgotpassword.fixtures.js";
import { emailQueue } from "../../../src/shared/queue/emailQueue.js";
describe(`POST ${URL} → QUEUE`, () => {
    it("should push send-otp job to email queue", async () => {
        await seedUser();
        const spy = jest.spyOn(emailQueue, "add");
        await request(app).post(URL).send(forgotPasswordPayload);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("send-otp", expect.objectContaining({
            email: forgotPasswordPayload.email,
            otp: expect.stringMatching(/^\d{6}$/),
        }));
    });
});
//# sourceMappingURL=forgotpassword.queue.test.js.map