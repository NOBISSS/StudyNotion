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
    if (!course || !course.isActive || course.status !== "Published") {
        throw AppError.notFound("Course not found or not available for enrollment");
    }
    if (course?.instructorId == userId && user?.accountType !== "admin") {
        throw AppError.badRequest("Instructor cannot enroll in their own course");
    }
    const courseEnrollment = await CourseEnrollment.create({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        enrolledAt: new Date(),
        amountPaid: course.originalPrice,
        instructorId: course.instructorId,
    });
    const courseProgress = await CourseProgress.create({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        progress: 0,
        completed: false,
        completedSubsections: [],
    });
    await Wishlist.findOneAndUpdate({ userId }, { $pull: { courseIds: courseId } }, { returnDocument: "after" });
    ApiResponse.success(res, {
        courseEnrollment,
    }, "Course enrollment created successfully");
});
export const EnrollInWishlist = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const user = req.user;
    if (!userId)
        throw AppError.unauthorized("User ID is required to enroll in course");
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist || wishlist.courseIds.length === 0) {
        throw AppError.badRequest("Wishlist is empty, no courses to enroll");
    }
    const existingEnrollment = await CourseEnrollment.find({
        userId: new Types.ObjectId(userId),
        courseId: { $in: wishlist.courseIds.map((id) => new Types.ObjectId(id)) },
    });
    if (existingEnrollment.length == wishlist.courseIds.length) {
        throw AppError.conflict("User is already enrolled in this courses");
    }
    const courses = await Course.find({
        _id: { $in: wishlist.courseIds },
        isActive: true,
        status: "Published",
    });
    if (!courses) {
        throw AppError.notFound("Course not found or not available for enrollment");
    }
    const enrollments = [];
    for (const course of courses) {
        if (existingEnrollment.some((enrollment) => enrollment.courseId.equals(course._id))) {
            continue;
        }
        if (course.instructorId.equals(userId) && user?.accountType !== "admin") {
            continue;
        }
        const courseEnrollment = await CourseEnrollment.create({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(course._id),
            enrolledAt: new Date(),
            amountPaid: course.originalPrice,
            instructorId: course.instructorId,
        });
        enrollments.push(courseEnrollment);
        const courseProgress = await CourseProgress.create({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(course._id),
            progress: 0,
            completed: false,
            completedSubsections: [],
        });
        await Wishlist.findOneAndUpdate({ userId }, { $pull: { courseIds: course._id } }, { returnDocument: "after" });
    }
    ApiResponse.success(res, { enrollments }, "Wishlist enrollment created successfully");
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