import { Queue, Worker } from "bullmq";
import redis from "../config/redis.js";

export function buildCourseEmbeddingText(course: any): string {
  return [
    `Course: ${course.courseName}`,
    `Level: ${course.level}`,
    `Type: ${course.typeOfCourse}`,
    `Instructor: ${course.instructorName}`,
    `Tags: ${course.tag.join(", ")}`,
    `What you will learn: ${course.whatYouWillLearn.join(". ")}`,
    `Description: ${course.description}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export const embeddingQueue = new Queue("embedding-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

new Worker(
  "course-embedding",
  async (job) => {
    const { course } = job.data;
  },
  {
    connection: redis,
    concurrency: 2,
  },
);

process.on("SIGINT", async () => {
  await embeddingQueue.close();
  process.exit();
});
