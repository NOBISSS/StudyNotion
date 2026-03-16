import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { Course } from "../course/CourseModel.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "./RatingAndReview.js";
import { CourseRatingAndReviewSchema } from "./ratingValidation.js";

export const rateAndReviewCourse = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = req.user;
  const parsedCourseData = CourseRatingAndReviewSchema.safeParse(req.body);
  if (!parsedCourseData.success) {
    throw AppError.badRequest(
      parsedCourseData.error.issues[0]?.message || "Invalid course Id",
    );
  }
  const { courseId, rating, review } = parsedCourseData.data;
  const existingReview = await RatingAndReview.findOne({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
  });
  if (existingReview) {
    throw AppError.conflict("User has already reviewed this course");
  }
  const course = await Course.findById(new Types.ObjectId(courseId));

  if (course?.instructorId == userId && user?.accountType !== "admin") {
    throw AppError.badRequest("Instructor cannot review their own course");
  }

  const isEnrolledInCourse = await CourseEnrollment.findOne({
    courseId: new Types.ObjectId(courseId),
    userId: new Types.ObjectId(userId),
  });

  if (!isEnrolledInCourse) {
    throw AppError.badRequest("You need to enroll in the course to review it");
  }

  const ratingAndReview = await RatingAndReview.create({
    userId: new Types.ObjectId(userId),
    courseId: new Types.ObjectId(courseId),
    rating,
    review,
  });
  ApiResponse.success(res, {
    message: "Course review created successfully",
    ratingAndReview,
  });
});
export const getAllReviews = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  if (!courseId) {
    throw AppError.badRequest("Course ID is required");
  }
  const courseReviews = await RatingAndReview.find({
    courseId: new Types.ObjectId(courseId),
    isActive: true,
  })
    .populate("userId")
    .sort({ createdAt: -1 });
  const reviewCount = courseReviews.length;
  const averageRating =
    courseReviews.reduce((acc, review) => acc + review.rating, 0) /
    (reviewCount || 1);
  ApiResponse.success(res, {
    message: "Course review retrieved successfully",
    courseReviews,
    reviewCount,
    averageRating,
  });
});
export const updateReview = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = req.user;
  const reviewId = req.params.reviewId;
  const parsedCourseData = CourseRatingAndReviewSchema.safeParse(req.body);
  if (!parsedCourseData.success) {
    throw AppError.badRequest(
      parsedCourseData.error.issues[0]?.message || "Invalid course Id",
    );
  }
  if (!reviewId) {
    throw AppError.badRequest("Review ID is required");
  }
  const { courseId, rating, review } = parsedCourseData.data;
  const course = await Course.findById(new Types.ObjectId(courseId));

  if (course?.instructorId == userId && user?.accountType !== "admin") {
    throw AppError.badRequest("Instructor cannot review their own course");
  }
  const existingReview = await RatingAndReview.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      _id: new Types.ObjectId(reviewId),
    },
    {
      $set: {
        rating,
        review,
      },
    },
  );
  if (!existingReview) {
    throw AppError.notFound("Review not found or user not authorized");
  }
  ApiResponse.success(res, {
    message: "Course review updated successfully",
    ratingAndReview: existingReview,
  });
});
export const deleteReview = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const reviewId = req.params.reviewId;
  if (!reviewId) {
    throw AppError.badRequest("Review ID is required");
  }
  const existingReview = await RatingAndReview.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      _id: new Types.ObjectId(reviewId),
    },
    { isActive: false },
    { new: true },
  );
  if (!existingReview) {
    throw AppError.notFound("Review not found or user not authorized");
  }
  ApiResponse.success(res, {
    message: "Course review deleted successfully",
    ratingAndReview: existingReview,
  });
});
