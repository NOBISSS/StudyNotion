import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { announcementQueue } from "../../shared/queue/announcementQueue.js";
import type { Handler } from "../../shared/types.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { isValidInstructor } from "../subsection/material/materialController.js";
import Announcement from "./announcementModel.js";
import { announcementValidation } from "./announcementValidation.js";

export const makeAnnouncement: Handler = asyncHandler(async (req, res) => {
  const parsedData = announcementValidation.safeParse(req.body);
  if (!parsedData.success) {
    throw AppError.badRequest(
      parsedData?.error?.issues[0]?.message || "Invalid input",
    );
  }
  const { title, message, courseId } = parsedData.data;
  const userId = req.userId;
  // Validate input
  if (!userId) {
    throw AppError.badRequest("User ID is required to make an announcement");
  }
  if (
    !(await isValidInstructor(
      new Types.ObjectId(courseId),
      userId,
      req.accountType,
    ))
  ) {
    throw AppError.forbidden(
      "Only instructors can make announcements for their courses",
    );
  }
  const announcement = await Announcement.create({ title, message, courseId });

  await announcementQueue.add("send-announcement", {
    title,
    message,
    email: req.user.email,
  });

  ApiResponse.success(
    res,
    { announcement },
    "Announcement created successfully",
  );
});
export const getAnnouncements: Handler = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  if (!courseId || typeof courseId !== "string") {
    throw AppError.badRequest("Course ID is required");
  }
  const userId = req.userId;
  if (!userId) {
    throw AppError.badRequest("User ID is required to get announcements");
  }
  const isEnrolled = await CourseEnrollment.findOne({
    userId,
    courseId: new Types.ObjectId(courseId),
  });
  if (!isEnrolled) {
    throw AppError.forbidden("You are not enrolled in this course");
  }
  const announcements = await Announcement.find({
    courseId: new Types.ObjectId(courseId),
  }).sort({ createdAt: -1 });
  const announcementsWithReadStatus = announcements.map((announcement) => {
    return {
      ...announcement.toObject(),
      isReaded: announcement.readedBy.some(
        (readerId) => readerId === userId,
      ),
    };
  });
  ApiResponse.success(
    res,
    { announcements: announcementsWithReadStatus },
    "Announcements retrieved successfully",
  );
});
