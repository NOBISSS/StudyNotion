import { Worker } from "bullmq";
import redis from "../config/redis.js";

import { Course } from "../../modules/course/CourseModel.js";
import User from "../../modules/user/UserModel.js";
import Wishlist from "../../modules/wishlist/wishlistModel.js";

import { emailQueue } from "../queue/emailQueue.js";
import { coursePublishedTemplate } from "../templates/coursePublishedTemplate.js";
import mongoose from "mongoose";

//await mongoose.connect("mongodb+srv://parthchauhan220:oyjK42JFXL9ky0rw@clusterone.earhqof.mongodb.net/StudyNotion");
//console.log("✅ Worker DB connected");

new Worker(
  "publish-course",
  async (job) => {
    console.log(" ✅JOB RECEIVED :",job.data);
    const { courseId, courseName } = job.data;

    // 1️ Publish course
    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        status: "Published",
        isScheduled: false,
        scheduledPublishAt: null,
        scheduledJobId: null,
      },
      { new: true }
    );

    if (!course) {
      console.warn(`[scheduleWorker] Course ${courseId} not found`);
      return;
    }

    // 2️ Get wishlisted users
    const wishlists = await Wishlist.find({
      courseIds: courseId,
      status: "active",
    })
      .select("userId")
      .lean();

    if (wishlists.length === 0) return;

    const userIds = wishlists.map((w) => w.userId);

    const users = await User.find({ _id: { $in: userIds } })
      .select("email firstName")
      .lean();

    //  Send emails (batched)
    const chunkSize = 100;

    for (let i = 0; i < users.length; i += chunkSize) {
      const chunk = users.slice(i, i + chunkSize);

      await Promise.all(
        chunk.map((user) =>
          emailQueue.add("publish-course", {
            to: user.email,
            subject: `"${courseName}" is now live on StudyNotion!`,
            html: coursePublishedTemplate({
              firstName: user.firstName,
              courseName,
              courseUrl: `${process.env.FRONTEND_URL || "FRONTEND URL"}/courses/${courseId}`,
              thumbnailUrl: course.thumbnailUrl,
            }),
          })
        )
      );
    }

    console.log(
      `[scheduleWorker] Published "${courseName}" (${courseId}) & notified ${users.length} users`
    );
  },
  {
    connection: redis,
  }
);