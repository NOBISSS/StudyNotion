import { Types } from "mongoose";
import z from "zod";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { Course } from "../course/CourseModel.js";
import CourseProgress from "../course/CourseProgress.js";
import { convertSecondsToReadingTime } from "../subsection/video/videoUtils.js";
import Wishlist from "../wishlist/wishlistModel.js";
import { CourseEnrollment } from "./CourseEnrollment.js";
export const EnrollInCourse = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const user = req.user;
    const parsedCourseData = z.string().safeParse(req.body.courseId);
    if (!parsedCourseData.success) {
        throw AppError.badRequest("Invalid course ID");
    }
    if (!userId)
        throw AppError.unauthorized("User ID is required to enroll in course");
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
    const courseProgress = await CourseProgress.create({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        progress: 0,
        completed: false,
        completedSubsections: [],
    });
    await Wishlist.findOneAndUpdate({ userId }, { $pull: { courseIds: courseId } }, { new: true });
    ApiResponse.success(res, {
        courseEnrollment,
    }, "Course enrollment created successfully");
});
export const getUserEnrollments = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const courseEnrollments = await CourseEnrollment.find({
        userId: new Types.ObjectId(userId),
        isActive: true,
    })
        .populate({
        path: "courseId",
        match: { isActive: true, status: "Published" },
    })
        .sort({ createdAt: -1 });
    const validEnrollments = courseEnrollments.filter((enrollment) => enrollment.courseId !== null);
    const courseEnrollmentsWithProgress = await Promise.all(validEnrollments.map(async (enrollment) => {
        const enrollmentObj = enrollment.toObject();
        const course = enrollmentObj.courseId;
        const courseProgress = await CourseProgress.findOne({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(course._id),
        });
        return {
            ...enrollmentObj,
            courseId: {
                _id: course._id,
                courseName: course.courseName,
                thumbnailUrl: course.thumbnailUrl,
                instructorId: course.instructorId,
                progress: courseProgress?.progress.toString() ?? "0",
                totalDuration: convertSecondsToReadingTime(course.totalDuration ?? 0)
                    .hhmmss,
            },
        };
    }));
    ApiResponse.success(res, { courseEnrollments: courseEnrollmentsWithProgress }, "Course enrollments retrieved successfully");
});
export const getAllEnrollments = asyncHandler(async (req, res) => {
    const courseEnrollments = await CourseEnrollment.find({})
        .populate("courseId")
        .sort({ createdAt: -1 });
    ApiResponse.success(res, {
        courseEnrollments,
    }, "Course enrollments retrieved successfully");
});
//# sourceMappingURL=courseEnrollmentController.js.map