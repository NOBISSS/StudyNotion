//Handle Delayed Jobs
//Jobs live in redis they survive server restarts and are never processed twice

import { Queue } from "bullmq";
import type { Types } from "mongoose";
import redis from "../config/redis.js";
export interface SchedulePublishPayload {
  courseId: Types.ObjectId;
  instructorId: Types.ObjectId;
  courseName: string;
  scheduledAt: string;
}

export const scheduleQueue = new Queue<SchedulePublishPayload>(
  "schedule-publish",
  {
    connection: redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 10_000 }, //10s->20s->40s
      removeOnComplete: 100, //keep last 100 completed jobs for audit
      removeOnFail: 200, //keep last 200 failed jobs for debugging -/ Testing
    },
  },
);

//Helpper

/**
 * Schedule a Course to be published at a specific future time
 */

//These Function Will Add a job in queue and return the job

export const schedulePublish = async (
  payload: SchedulePublishPayload,
  publishAt: Date,
) => {
  const delay = publishAt.getTime() - Date.now();
  if (!delay || delay <= 0 || isNaN(delay))
    throw new Error("scheduledPublishAt must be in the future");

  console.log(
    `📬 schedulePublish called, delay: ${Math.round(delay / 1000)}s`,
    payload,
  );
  const job = await scheduleQueue.add("publish-course", payload, { delay });
  console.log(`✅ Job queued with ID: ${job.id}`);
  return job;
};

//These Funtion will cancel the Schedule and remove the job from the queue
export const cancelScheduledPublish = async (jobId: string) => {
  const job = await scheduleQueue.getJob(jobId);
  if (job) await job.remove();
};

//Reschedule
export const reschedulePublish = async (
  oldJobId: string | undefined,
  payload: SchedulePublishPayload,
  newPublishAt: Date,
) => {
  if (oldJobId) {
    await cancelScheduledPublish(oldJobId);
  }
  const delay = newPublishAt.getTime() - Date.now();
  if (delay <= 0) throw new Error("New Publish Time Must be in future date");

  return scheduleQueue.add("publish-course", payload, {
    delay,
  });
};

process.on("SIGINT", async () => {
  await scheduleQueue.close();
  process.exit();
});
