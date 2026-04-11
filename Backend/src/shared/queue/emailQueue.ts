import { Queue, Worker } from "bullmq";
import redis from "../config/redis.js";
import { OtpTemp } from "../templates/OTPTemplate.js";
import { sendMail } from "../utils/mailer.js";

export const emailQueue = new Queue("email-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

new Worker(
  "email-queue",
  async (job) => {
    switch (job.name) {
      case "send-otp": {
        const { email, otp } = job.data
        const html = OtpTemp(otp as string);
        await sendMail(email, "Your StudyNotion OTP Code", html);
        console.log(`OTP email sent to ${email}`);
        break;
      }
      case "publish-course": {
        const { to, subject, html } = job.data;
        await sendMail(to, subject, html);
        console.log("Course Email send to " + to);
        break;
      }
      case "send-email": {
        const { to, subject, html } = job.data;
        await sendMail(to, subject, html);
        break;
      }
      default:
        throw new Error(`Unknown email job type`);
    }
  },
  {
    connection: redis,
    concurrency: 10,
  },
);

process.on("SIGINT", async () => {
  await emailQueue.close();
  process.exit();
});
