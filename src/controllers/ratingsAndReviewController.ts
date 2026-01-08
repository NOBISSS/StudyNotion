import { Types } from "mongoose";
import z from "zod";
import { CourseEnrollment } from "../models/CourseEnrollment.js";
import { Course } from "../models/CourseModel.js";
import { RatingAndReview } from "../models/RatingAndReview.js";
import { StatusCode, type Handler } from "../types.js";

const CourseRatingAndReviewSchema = z.object({
  courseId: z.string(),
  rating: z.number().min(1).max(5),
  review: z.string().min(10).max(500),
});

export const rateAndReviewCourse: Handler = async (req, res) => {
  try {
    const userId = req.userId;
    const user = req.user;
    const parsedCourseData = CourseRatingAndReviewSchema.safeParse(req.body);
    if (!parsedCourseData.success) {
      res.status(StatusCode.InputError).json({
        message:
          parsedCourseData.error.issues[0]?.message || "Invalid course Id",
      });
      return;
    }
    const { courseId, rating, review } = parsedCourseData.data;
    const existingReview = await RatingAndReview.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });
    if (existingReview) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "User has already reviewed this course" });
      return;
    }
    const course = await Course.findById(new Types.ObjectId(courseId));

    if (course?.instructorId == userId && user?.accountType !== "admin") {
      res
        .status(StatusCode.InputError)
        .json({ message: "Instructor cannot review their own course" });
      return;
    }

    const isEnrolledInCourse = await CourseEnrollment.findOne({
      courseId: new Types.ObjectId(courseId),
      userId: new Types.ObjectId(userId),
    });

    if (!isEnrolledInCourse) {
      res
        .status(StatusCode.InputError)
        .json({ message: "You need to enroll in course to review" });
      return;
    }

    const ratingAndReview = await RatingAndReview.create({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      rating,
      review,
    });
    res.status(StatusCode.Success).json({
      message: "Course review created successfully",
      ratingAndReview,
    });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const getAllReviews: Handler = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (!courseId) {
      res
        .status(StatusCode.InputError)
        .json({ message: "Course ID is required" });
      return;
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
    res.status(StatusCode.Success).json({
      message: "Course review retrieved successfully",
      courseReviews,
      reviewCount,
      averageRating,
    });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const updateReview: Handler = async (req, res) => {
  try {
    const userId = req.userId;
    const user = req.user;
    const reviewId = req.params.reviewId;
    const parsedCourseData = CourseRatingAndReviewSchema.safeParse(req.body);
    if (!parsedCourseData.success) {
      res.status(StatusCode.InputError).json({
        message:
          parsedCourseData.error.issues[0]?.message || "Invalid course Id",
      });
      return;
    }
    if (!reviewId) {
      res
        .status(StatusCode.InputError)
        .json({ message: "Review ID is required" });
      return;
    }
    const { courseId, rating, review } = parsedCourseData.data;
    const course = await Course.findById(new Types.ObjectId(courseId));

    if (course?.instructorId == userId && user?.accountType !== "admin") {
      res
        .status(StatusCode.InputError)
        .json({ message: "Instructor cannot review their own course" });
      return;
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
      }
    );
    if (!existingReview) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "Review not found or user not authorized" });
      return;
    }
    res.status(StatusCode.Success).json({
      message: "Course review updated successfully",
      ratingAndReview: existingReview,
    });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const deleteReview: Handler = async (req, res) => {
  try {
    const userId = req.userId;
    const reviewId = req.params.reviewId;
    if (!reviewId) {
      res
        .status(StatusCode.InputError)
        .json({ message: "Review ID is required" });
      return;
    }
    const existingReview = await RatingAndReview.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        _id: new Types.ObjectId(reviewId),
      },
      { isActive: false },
      { new: true }
    );
    if (!existingReview) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "Review not found or user not authorized" });
      return;
    }
    res.status(StatusCode.Success).json({
      message: "Course review deleted successfully",
      ratingAndReview: existingReview,
    });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
