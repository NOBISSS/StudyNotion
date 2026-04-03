import { Queue, Worker } from "bullmq";
import redis from "../config/redis.js";
import { generateCourseEmbedding } from "../vector/generateCourseEmbedding.js";
export function buildCourseEmbeddingText(course) {
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
const worker = new Worker("embedding-queue", async (job) => {
    const { course } = job.data;
    console.log(`Processing embedding for course: ${course.courseName}`);
    await generateCourseEmbedding(course);
}, {
    connection: redis,
    concurrency: 2,
});
worker.on("completed", (job) => {
    console.log(`Embedding Job - ${job.id} completed`);
});
process.on("SIGINT", async () => {
    await embeddingQueue.close();
    process.exit();
});
//# sourceMappingURL=embeddingQueue.js.map