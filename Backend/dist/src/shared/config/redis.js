import dotenv from "dotenv";
import { Redis } from "ioredis";
dotenv.config();
const redisOptions = {
    maxRetriesPerRequest: null,
    retryStrategy: (times) => Math.min(times * 50, 2000),
};
export const createRedisConnection = () => new Redis(process.env.REDIS_URL, redisOptions);
const redis = createRedisConnection();
redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err.message));
export default redis;
//# sourceMappingURL=redis.js.map