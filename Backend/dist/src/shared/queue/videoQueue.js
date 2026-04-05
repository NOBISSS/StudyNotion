import { Queue, Worker } from "bullmq";
import dotenv from "dotenv";
import redis from "../config/redis.js";
import { processVideo } from "../utils/ffmpegProcessor.js";
dotenv.config();
export const videoQueue = new Queue("video-processing", {
    connection: redis,
});
dotenv.config();
const connection = { url: process.env.REDIS_URL || "redis://127.0.0.1:6379" };
const worker = new Worker("video-processing", async (job) => {
    console.log("Worker received job:", job.id, job.name, job.data);
    await processVideo(job.data);
}, { connection });
worker.on("active", (job) => console.log("Job active:", job.id, job.name));
worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});
worker.on("failed", (job, err) => {
    console.error(`Job ${job ? job.id : "unknown"} failed:`, err.message);
});
worker.on("error", (err) => console.error("Worker error:", err));
process.on("SIGINT", async () => {
    await videoQueue.close();
    process.exit();
});
//# sourceMappingURL=videoQueue.js.map