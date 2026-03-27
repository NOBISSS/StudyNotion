import dotenv from "dotenv";
import { Redis } from "ioredis";
dotenv.config();
const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
    retryStrategy: (times) => Math.min(times * 50, 2000),
});
export default redis;
//# sourceMappingURL=redis.js.map