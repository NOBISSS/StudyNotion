import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import type { Handler } from "../../shared/types.js";
import { Course } from "../course/CourseModel.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";

export const instructorDashboard: Handler = asyncHandler(async (req, res) => {
  const instructorId = req.userId;
  if (!instructorId) {
    throw AppError.unauthorized("Unauthorized access");
  }
  const totalStudents = await CourseEnrollment.countDocuments({ instructorId });
  const currentMonthEnrolledStudents = await CourseEnrollment.countDocuments({
    instructorId,
    enrolledAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  });
  const monthlyEnrollments = await CourseEnrollment.aggregate([
    { $match: { instructorId } },
    {
      $group: {
        _id: { month: { $month: "$enrolledAt" }, year: { $year: "$enrolledAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $project: { month: "$_id.month", year: "$_id.year", count: 1, _id: 0 } },
    { $limit: 7 },
  ]);
  const totalRevenue = await CourseEnrollment.aggregate([
    { $match: { instructorId } },
    { $group: { _id: null, total: { $sum: "$amountPaid" } } },
    {
      $project: {
        total: 1,
        _id: 0,
      },
    },
  ]);
  const monthlyRevenue = await CourseEnrollment.aggregate([
    { $match: { instructorId } },
    {
      $group: {
        _id: { month: { $month: "$enrolledAt" }, year: { $year: "$enrolledAt" } },
        total: { $sum: "$amountPaid" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $project: { month: "$_id.month", year: "$_id.year", count: 1, _id: 0, revenue: "$total" } },
  ]);
  const instructorCourses = await Course.find({ instructorId });
  const totalCourses = instructorCourses.length;
  const publishedCourses = instructorCourses.filter(
    (course) => course.status == "Published",
  ).length;
  const draftCourses = totalCourses - publishedCourses;
  const countryWiseEnrollments = await CourseEnrollment.aggregate([
    { $match: { instructorId } },
    {
      $lookup: {
        from: "profiles",
        localField: "userId",
        foreignField: "userId",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $group: { _id: "$user.country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    {
      $project: {
        country: "$_id",
        _id: 0,
        count: 1,
      },
    },
  ]);
  const recentReviews = await RatingAndReview.find({ instructorId })
    .populate("courseId", "courseName")
    .populate("userId", "name")
    .sort({ enrolledAt: -1 })
    .limit(5);
  const averageRating = await RatingAndReview.aggregate([
    { $match: { courseId: { $in: instructorCourses.map((c) => c._id) } } },
    { $group: { _id: null, average: { $avg: "$rating" } } },
    { $project: { _id: 0, average: 1 } },
  ]);
  const coursesWithTotalStudentRatingAndRevenue = await Course.aggregate([
    { $match: { instructorId } },
    {
      $lookup: {
        from: "courseenrollments",
        localField: "_id",
        foreignField: "courseId",
        as: "enrollments",
      },
    },
    {
      $lookup: {
        from: "ratingandreviews",
        localField: "_id",
        foreignField: "courseId",
        as: "reviews",
      },
    },
    {
      $lookup: {
        from: "courseprogresses",
        localField: "_id",
        foreignField: "courseId",
        as: "progresses",
      },
    },
    {
      $addFields: {
        totalStudents: { $size: "$enrollments" },
        averageRating: { $avg: "$reviews.rating" },
        totalRevenue: { $sum: "$enrollments.amountPaid" },
        averageProgress: { $avg: "$progresses.progress" },
        completionRate: { $sum: { $cond: ["$progresses.completed", 1, 0] } },
      },
    },
    {
        $project: {
            courseName: 1,
            totalStudents: 1,
            averageRating: { $ifNull: ["$averageRating", 0] },
            totalRevenue: { $cond: { if: { $eq: ["$typeOfCourse", "Paid"] }, then: "$totalRevenue", else: "Free" } },
            _id: 1,
            averageProgress: { $ifNull: ["$averageProgress", 0] },
            completionRate: { $cond: [{ $gt: ["$totalStudents", 0] }, { $multiply: [{ $divide: ["$completionRate", "$totalStudents"] }, 100] }, 0] } 
        },
    },
  ]);
  ApiResponse.success(res, {
    totalStudents,
    currentMonthEnrolledStudents,
    monthlyEnrollments,
    totalRevenue,
    monthlyRevenue,
    totalCourses,
    publishedCourses,
    draftCourses,
    countryWiseEnrollments,
    recentReviews,
    averageRating,
    courses: coursesWithTotalStudentRatingAndRevenue,
  });
});
