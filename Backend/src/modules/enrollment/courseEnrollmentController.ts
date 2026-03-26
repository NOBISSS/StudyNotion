import { Types } from "mongoose";
import z from "zod";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { Course } from "../course/CourseModel.js";
import { CourseEnrollment } from "./CourseEnrollment.js";
import type { Handler } from "../../shared/types.js";

export const EnrollInCourse:Handler = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = req.user;
  const parsedCourseData = z.string().safeParse(req.body.courseId);
  if (!parsedCourseData.success) {
    throw AppError.badRequest("Invalid course ID");
  }
  const courseId = parsedCourseData.data;
  const existingEnrollment = await CourseEnrollment.findOne({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
  });
  if (existingEnrollment) {
    throw AppError.conflict("User is already enrolled in this course");
  }
  const course = await Course.findById(new Types.ObjectId(courseId));

  if (course?.instructorId == userId && user?.accountType !== "admin") {
    throw AppError.badRequest("Instructor cannot enroll in their own course");
  }
  const courseEnrollment = await CourseEnrollment.create({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
  });
  ApiResponse.success(
    res,
    {
      courseEnrollment,
    },
    "Course enrollment created successfully",
  );
});
export const getUserEnrollments:Handler = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const courseEnrollments = await CourseEnrollment.find({
    userId: new Types.ObjectId(userId),
  })
    .populate("courseId")
    .sort({ createdAt: -1 });
  const courseEnrollmentsWithProgress = courseEnrollments.map((enrollment) => {
    const enrollmentObj = enrollment.toObject();
    const course = enrollmentObj.courseId as any;
    return {
      ...enrollmentObj,
      courseId:
        typeof course === "object"
          ? {
              _id: course?._id || "",
              courseName: course?.courseName || "",
              thumbnailUrl: course?.thumbnailUrl || "",
              instructorId: course?.instructorId || "",
              progress: "0",
              totalDuration: "2:30:00",
            }
          : enrollmentObj.courseId,
    };
  });
  ApiResponse.success(
    res,
    {
      courseEnrollments: courseEnrollmentsWithProgress,
    },
    "Course enrollments retrieved successfully",
  );
});
export const getAllEnrollments = asyncHandler(async (req, res) => {
  const courseEnrollments = await CourseEnrollment.find({})
    .populate("courseId")
    .sort({ createdAt: -1 });
  ApiResponse.success(
    res,
    {
      courseEnrollments,
    },
    "Course enrollments retrieved successfully",
  );
});
