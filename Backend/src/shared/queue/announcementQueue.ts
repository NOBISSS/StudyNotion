import { Queue, Worker } from "bullmq";
import redis from "../config/redis.js";
import { AnnouncementTemp } from "../templates/announcementTemplate.js";
import { sendMail } from "../utils/mailer.js";

export const announcementQueue = new Queue("announcement-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

new Worker(
  "announcement-queue",
  async (job) => {
    const { email, title, message } = job.data;
    const html = AnnouncementTemp(title as string, message as string);
    await sendMail(email, title as string, html);
  },
  {
    connection: redis,
    concurrency: 10,
  },
);

process.on("SIGINT", async () => {
  await announcementQueue.close();
  process.exit();
});
