import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import type { Handler } from "../../shared/types.js";
import { Course } from "../course/CourseModel.js";
import CourseProgress from "../course/CourseProgress.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const instructorDashboard: Handler = asyncHandler(async (req, res) => {
  const instructorId = req.userId;

  if (!instructorId) throw AppError.unauthorized("Instructor ID is required");

  const instructorCourses = await Course.find({
    instructorId,
    isActive: true,
  });

  const totalCourses = instructorCourses.length;
  const publishedCourses = instructorCourses.filter(
    (c) => c.status === "Published"
  ).length;
  const draftCourses = totalCourses - publishedCourses;
  const courseIds = instructorCourses.map((c) => c._id);
  const totalStudents = await CourseEnrollment.countDocuments({
    instructorId,
    isActive: true,
  });

  const currentMonthEnrolledStudents = await CourseEnrollment.countDocuments({
    instructorId,
    isActive: true,
    enrolledAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    },
  });
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyEnrollments = await CourseEnrollment.aggregate([
    {
      $match: {
        instructorId,
        isActive: true,
        enrolledAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$enrolledAt" },
          year: { $year: "$enrolledAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        count: 1,
      },
    },
  ]);
  const totalRevenueAgg = await CourseEnrollment.aggregate([
    { $match: { instructorId, isActive: true } },
    { $group: { _id: null, total: { $sum: "$amountPaid" } } },
    { $project: { _id: 0, total: 1 } },
  ]);

  const monthlyRevenue = await CourseEnrollment.aggregate([
    {
      $match: {
        instructorId,
        isActive: true,
        enrolledAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$enrolledAt" },
          year: { $year: "$enrolledAt" },
        },
        revenue: { $sum: "$amountPaid" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        revenue: 1,
        count: 1,
      },
    },
  ]);
  const overAllCompletionRate = await CourseProgress.aggregate([
    { $match: { courseId: { $in: courseIds } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        completionRate: {
          $cond: [
            { $gt: ["$total", 0] },
            // Fix: divide by $total not totalStudents variable
            { $multiply: [{ $divide: ["$completed", "$total"] }, 100] },
            0,
          ],
        },
      },
    },
  ]);
  const countryWiseEnrollments = await CourseEnrollment.aggregate([
    { $match: { instructorId, isActive: true } },
    {
      $lookup: {
        from: "profiles",
        localField: "userId",
        foreignField: "userId",
        as: "user",
      },
    },
    { $unwind: { path: "$user",preserveNullAndEmptyArrays:false } },
    { $group: { _id: "$user.country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        country: { $ifNull: ["$_id", "Unknown"] },
        count: 1,
        pct: {
          $cond: [
            { $gt: [totalStudents, 0] },
            { $multiply: [{ $divide: ["$count", totalStudents] }, 100] },
            0,
          ],
        },
      },
    },
  ]);
  const recentReviews = await RatingAndReview.find({
    courseId: { $in: courseIds },
    isActive: true,
  })
    .populate("courseId", "courseName")
    .populate("userId", "firstName lastName")
    .sort({ createdAt: -1 })
    .limit(5);

  const totalReviews = await RatingAndReview.countDocuments({
    courseId: { $in: courseIds },
    isActive: true,
  });

  const averageRatingAgg = await RatingAndReview.aggregate([
    { $match: { courseId: { $in: courseIds }, isActive: true } },
    { $group: { _id: null, average: { $avg: "$rating" } } },
    { $project: { _id: 0, average: { $round: ["$average", 1] } } },
  ]);
  const courses = await Course.aggregate([
    { $match: { instructorId, isActive: true } },
    {
      $lookup: {
        from: "courseenrollments",
        localField: "_id",
        foreignField: "courseId",
        pipeline: [{ $match: { isActive: true } }],
        as: "enrollments",
      },
    },
    {
      $lookup: {
        from: "ratingandreviews",
        localField: "_id",
        foreignField: "courseId",
        pipeline: [{ $match: { isActive: true } }],
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
        // Fix: correctly count completed progresses using $filter
        completedCount: {
          $size: {
            $filter: {
              input: "$progresses",
              as: "p",
              cond: { $eq: ["$$p.completed", true] },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: "$courseName",
        thumbnail: "$thumbnailUrl",
        status: 1,
        students: "$totalStudents",
        rating: { $ifNull: [{ $round: ["$averageRating", 1] }, 0] },
        revenue: {
          $cond: {
            if: { $eq: ["$typeOfCourse", "Paid"] },
            then: "$totalRevenue",
            else: "Free",
          },
        },
        averageProgress: { $ifNull: [{ $round: ["$averageProgress", 1] }, 0] },
        // Fix: completion rate as percentage
        completion: {
          $cond: [
            { $gt: ["$totalStudents", 0] },
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$completedCount", "$totalStudents"] },
                    100,
                  ],
                },
                1,
              ],
            },
            0,
          ],
        },
      },
    },
    { $sort: { students: -1 } },
  ]);
  ApiResponse.success(res, {
    // Students
    totalStudents,
    newStudentsThisMonth: currentMonthEnrolledStudents,

    // Courses
    totalCourses,
    publishedCourses,
    draftCourses,

    // Revenue
    totalRevenue: totalRevenueAgg[0]?.total || 0,
    revenueThisMonth: monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0,

    // Charts
    monthLabels: monthlyRevenue.map(
      (m) => monthNames[m.month - 1] + " " + m.year
    ),
    monthlyRevenue: monthlyRevenue.map((m) => m.revenue),
    enrollmentTrend: monthlyEnrollments.map((m) => m.count),

    // Completion
    completionRate: overAllCompletionRate[0]?.completionRate || 0,

    // Geography
    studentLocations: countryWiseEnrollments,

    // Reviews
    totalReviews,
    recentReviews,
    avgCourseRating: averageRatingAgg[0]?.average || 0,

    // Per-course breakdown
    topCourses: courses,
  });
});
const DUMMY = {
  avgQuizScore: 74,
  dropOffData: [88, 75, 62, 54, 48, 41, 38],
  dropOffLabels: ["Intro", "Ch.2", "Ch.3", "Ch.4", "Ch.5", "Ch.6", "Ch.7"],
};
