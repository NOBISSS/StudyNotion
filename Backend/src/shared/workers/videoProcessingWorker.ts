// backend/worker.js
import { Worker } from "bullmq";
import dotenv from "dotenv";
import { processVideo } from "../utils/ffmpegProcessor.js";


dotenv.config();

const connection = { url: process.env.REDIS_URL || "redis://127.0.0.1:6379" };

const worker = new Worker(
  "video-processing",
  async (job) => {
    console.log("Worker received job:", job.id, job.name, job.data);
    await processVideo(job.data);

  },
  { connection }
);

worker.on("active", job => console.log("Job active:", job.id, job.name));

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});
worker.on("failed", (job, err) => {
  console.error(`Job ${job ? job.id : "unknown"} failed:`, err.message);
});

worker.on("error", err => console.error("Worker error:", err));
console.log("Worker initialized");
