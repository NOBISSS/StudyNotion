import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { announcementQueue } from "../../shared/queue/announcementQueue.js";
import type { Handler } from "../../shared/types.js";
import { isValidInstructor } from "../subsection/material/materialController.js";
import Announcement from "./announcementModel.js";

export const makeAnnouncement: Handler = asyncHandler(async (req, res) => {
  const { title, message, courseId } = req.body;
  const userId = req.userId;
  // Validate input
  if (!title || !message || !courseId || !userId) {
    throw AppError.badRequest(
      "Title, message, and courseId are required to make an announcement",
    );
  }
  if (!(await isValidInstructor(courseId, userId, req.accountType))) {
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