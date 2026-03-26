import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { announcementQueue } from "../../shared/queue/announcementQueue.js";
import type { Handler } from "../../shared/types.js";
import type { Request, Response } from "express";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { isValidInstructor } from "../subsection/material/materialController.js";
import Announcement from "./announcementModel.js";
import { announcementValidation, updateAnnouncementValidation } from "./announcementValidation.js";

const WS_INTERNAL_URL =
  process.env.WS_INTERNAL_URL || "http://127.0.0.1:3002/announce";
const INTERNAL_SECRET = process.env.INTERNAL_SECRET as string;

/**
 * Notifies the WebSocket server to broadcast the announcement
 * to all enrolled students currently connected.
 * Non-blocking — a failure here won't break the HTTP response.
 */
async function notifyWebSocketServer(
  courseId: string,
  instructorId: string,
  announcement: object,
): Promise<void> {
  try {
    const res = await fetch(WS_INTERNAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({ courseId, instructorId, announcement }),
    });

    if (!res.ok) {
      console.error("WS server returned error:", res.status, await res.text());
    }
  } catch (err) {
    // Don't throw — WS broadcast failing should not fail the announcement creation
    console.error("Failed to notify WebSocket server:", err);
  }
}

export const makeAnnouncement: Handler = asyncHandler(async (req:Request, res:Response) => {
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
  const announcement = await Announcement.create({ title, message, courseId, createdBy: userId });

  await announcementQueue.add("send-announcement", {
    title,
    message,
    email: req.user.email,
    instructorName: req.user.firstName + " " + req.user.lastName,
  });
  notifyWebSocketServer(courseId, userId.toString(), {
    title,
    message,
    courseId,
    announcementId: announcement._id,
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
    isDeleted: false,
  }).sort({ createdAt: -1 });
  let announcementsWithReadStatus = announcements.map((announcement) => {
    return {
      ...announcement.toObject(),
      isReaded: announcement.readedBy.some((readerId) => readerId.toString() === userId.toString()),
    };
  });
  if (req.path.includes("getread")) {
    // Filter only read announcements
    announcementsWithReadStatus = announcementsWithReadStatus.filter(
      (ann) => ann.isReaded,
    );
  } else if (req.path.includes("getunread")) {
    // Filter only unread announcements
    announcementsWithReadStatus = announcementsWithReadStatus.filter(
      (ann) => !ann.isReaded,
    );
  }
  ApiResponse.success(
    res,
    { announcements: announcementsWithReadStatus },
    "Announcements retrieved successfully",
  );
});
export const markAnnouncementReadOrUnread: Handler = asyncHandler(async (req, res) => {
  const { announcementId } = req.params;
  if (!announcementId || typeof announcementId !== "string") {
    throw AppError.badRequest("Announcement ID is required");
  }
  const userId = req.userId;
  if (!userId) {
    throw AppError.badRequest("User ID is required to mark announcement as read");
  }
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw AppError.notFound("Announcement not found");
  }
  if(req.path.includes("markunread")){
    announcement.readedBy = announcement.readedBy.filter((readerId) => readerId.toString() !== userId.toString());
    await announcement.save();
    return ApiResponse.success(res, null, "Announcement marked as unread");
  }
  if (!announcement.readedBy.includes(userId)) {
    announcement.readedBy.push(userId);
    await announcement.save();
  }
  ApiResponse.success(res, null, "Announcement marked as read");
});
export const updateAnnouncement:Handler = asyncHandler(async (req,res) => {
  const parsedData = updateAnnouncementValidation.safeParse(req.body);
  if (!parsedData.success) {
    throw AppError.badRequest(
      parsedData?.error?.issues[0]?.message || "Invalid input",
    );
  }
  const { title, message } = parsedData.data;
  const { announcementId } = req.params;
  if (!announcementId || typeof announcementId !== "string") {
    throw AppError.badRequest("Announcement ID is required");
  }
  const userId = req.userId;
  if (!userId) {
    throw AppError.badRequest("User ID is required to update announcement");
  }
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw AppError.notFound("Announcement not found");
  }
  if (announcement.createdBy !== userId) {
    throw AppError.forbidden("You are not the owner of this announcement");
  }
  Object.assign(announcement, { title, message });
  await announcement.save();
  ApiResponse.success(res, { announcement }, "Announcement updated successfully");
});
export const deleteAnnouncement: Handler = asyncHandler(async (req, res) => {
  const { announcementId } = req.params;
  if (!announcementId || typeof announcementId !== "string") {
    throw AppError.badRequest("Announcement ID is required");
  }
  const userId = req.userId;
  if (!userId) {
    throw AppError.badRequest("User ID is required to delete announcement");
  }
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw AppError.notFound("Announcement not found");
  }
  if (announcement.createdBy !== userId) {
    throw AppError.forbidden("You are not the owner of this announcement");
  }
  await Announcement.findByIdAndUpdate(announcementId, { isDeleted: true });
  ApiResponse.success(res, null, "Announcement deleted successfully");
});