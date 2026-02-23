import { Queue } from "bullmq";
import dotenv from "dotenv";
import redis from "../config/redis.js";
dotenv.config();

export const videoQueue = new Queue("video-processing", {
  connection: redis,
});
