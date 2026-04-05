import { Queue } from "bullmq";
import { createRedisConnection } from "../config/redis.js";
const redis = createRedisConnection();
export const scheduleQueue = new Queue("schedule-publish", {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 10_000 },
        removeOnComplete: 100,
        removeOnFail: 200,
    },
});
export const schedulePublish = async (payload, publishAt) => {
    const delay = publishAt.getTime() - Date.now();
    if (!delay || delay <= 0 || isNaN(delay))
        throw new Error("scheduledPublishAt must be in the future");
    console.log(`📬 schedulePublish called, delay: ${Math.round(delay / 1000)}s`, payload);
    const job = await scheduleQueue.add("publish-course", payload, { delay });
    console.log(`✅ Job queued with ID: ${job.id}`);
    return job;
};
export const cancelScheduledPublish = async (jobId) => {
    const job = await scheduleQueue.getJob(jobId);
    if (job)
        await job.remove();
};
export const reschedulePublish = async (oldJobId, payload, newPublishAt) => {
    if (oldJobId) {
        await cancelScheduledPublish(oldJobId);
    }
    const delay = newPublishAt.getTime() - Date.now();
    if (delay <= 0)
        throw new Error("New Publish Time Must be in future date");
    return scheduleQueue.add("publish-course", payload, {
        delay,
    });
};
process.on("SIGINT", async () => {
    await scheduleQueue.close();
    process.exit();
});
//# sourceMappingURL=scheduleQueue.js.map