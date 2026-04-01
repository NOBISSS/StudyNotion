import dotenv from "dotenv";
import { Redis } from "ioredis";
dotenv.config();

const redisOptions = {
  maxRetriesPerRequest: null as null,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
};

// Factory — call this to get a fresh connection each time
export const createRedisConnection = () =>
  new Redis(process.env.REDIS_URL!, redisOptions);

// Default export for one-off use (e.g. emailQueue)
const redis = createRedisConnection();
redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err.message));

export default redis;