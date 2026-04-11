import mongoose from "mongoose";
import { Course } from "../src/modules/course/CourseModel.js";
import { schedulePublish } from "../src/shared/queue/scheduleQueue.js";
const course = await Course.create({
    courseName: "Test Scheduled Course",
    description: "Testing scheduling feature",
    instructorId: new mongoose.Types.ObjectId(),
    instructorName: "Test Instructor",
    categoryId: new mongoose.Types.ObjectId(),
    typeOfCourse: "Free",
    level: "Beginner",
    slug: `test-course-${Date.now()}`,
    thumbnailUrl: "https://plus.unsplash.com/premium_photo-1670426500778-80d177da0973?q=80&w=856&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
});
console.log("Course created:", course._id);
const publishAt = new Date(Date.now() + 60 * 1000);
const job = await schedulePublish({
    courseId: course._id,
    instructorId: course.instructorId,
    courseName: course.courseName,
    scheduledAt: new Date().toISOString(),
}, publishAt);
console.log("Job scheduled:", job.id);
console.log("Will publish at:", publishAt.toLocaleTimeString());
//# sourceMappingURL=testSchedule.js.map