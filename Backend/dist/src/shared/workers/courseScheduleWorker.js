console.log("📁 scheduleWorker FILE LOADED");
import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { Course } from "../../modules/course/CourseModel.js";
import User from "../../modules/user/UserModel.js";
import Wishlist from "../../modules/wishlist/wishlistModel.js";
import { emailQueue } from "../queue/emailQueue.js";
import { coursePublishedTemplate } from "../templates/coursePublishedTemplate.js";
const worker = new Worker("schedule-publish", async (job) => {
    console.log(" ✅JOB RECEIVED :", job.data);
    const { courseId, courseName } = job.data;
    const course = await Course.findByIdAndUpdate(courseId, {
        status: "Published",
        isScheduled: false,
        scheduledPublishAt: null,
        scheduledJobId: null,
    }, { new: true });
    if (!course) {
        console.warn(`[scheduleWorker] Course ${courseId} not found`);
        return;
    }
    const wishlists = await Wishlist.find({
        courseIds: courseId,
        status: "active",
    })
        .select("userId")
        .lean();
    if (wishlists.length === 0)
        return;
    const userIds = wishlists.map((w) => w.userId);
    const users = await User.find({ _id: { $in: userIds } })
        .select("email firstName")
        .lean();
    const chunkSize = 100;
    for (let i = 0; i < users.length; i += chunkSize) {
        const chunk = users.slice(i, i + chunkSize);
        await Promise.all(chunk.map((user) => emailQueue.add("publish-course", {
            to: user.email,
            subject: `"${courseName}" is now live on StudyNotion!`,
            html: coursePublishedTemplate({
                firstName: user.firstName,
                courseName,
                courseUrl: `${process.env.FRONTEND_URL || "FRONTEND URL"}/courses/${courseId}`,
                thumbnailUrl: course.thumbnailUrl ? course.thumbnailUrl : "",
            }),
        })));
    }
    console.log(`[scheduleWorker] Published "${courseName}" (${courseId}) & notified ${users.length} users`);
}, {
    connection: redis,
});
worker.on("active", (job) => console.log("Job active:", job.id, job.name));
worker.on("ready", () => console.log("🟢 Worker is ready and listening"));
worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});
worker.on("failed", (job, err) => {
    console.error(`Job ${job ? job.id : "unknown"} failed:`, err.message);
});
worker.on("error", (err) => console.error("Worker error:", err));
console.log("Schedule Worker Initiated");
//# sourceMappingURL=courseScheduleWorker.js.map