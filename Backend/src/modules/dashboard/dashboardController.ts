import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import type { Handler } from "../../shared/types.js";
import { Course } from "../course/CourseModel.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const instructorDashboard: Handler = asyncHandler(async (req, res) => {
  let instructorId = new Types.ObjectId(req.query.instructorId as string | undefined);
  if (!instructorId) {
    instructorId = req.userId!;
  }
  if (!instructorId) {
    throw AppError.badRequest("Instructor ID is required");
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
//   let monthlyRevenueWithZeros = [];
//   if(monthlyRevenue.length < 7){
//     for(let i = 0; i < 7 - monthlyRevenue.length; i++){
//       monthlyRevenueWithZeros.push({
//         month: i + 1,
//         year: new Date().getFullYear(),
//         revenue: 0
//       });
//     }
//   }
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
    { $group: { _id: "$user.country", pct: { $sum: 1 } } },
    { $sort: { pct: -1 } },
    {
      $project: {
        country: "$_id",
        _id: 0,
        pct: {
          $cond: [
            { $gt: ["$pct", 0] },
            {
              $multiply: [
                { $divide: ["$pct", totalStudents] },
                100,
              ],
            },
            0,
          ],
        },
      },
    },
  ]);
  const recentReviews = await RatingAndReview.find({ courseId: { $in: instructorCourses.map((c) => c._id) } })
    .populate("courseId", "courseName")
    .populate("userId", "name")
    .sort({ enrolledAt: -1 })
    .limit(5);
  const totalReviews = await RatingAndReview.countDocuments({ courseId: { $in: instructorCourses.map((c) => c._id) } });
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
            name: "$courseName",
            students: "$totalStudents",
            rating: { $ifNull: ["$averageRating", 0] },
            revenue: { $cond: { if: { $eq: ["$typeOfCourse", "Paid"] }, then: "$totalRevenue", else: "Free" } },
            _id: 1,
            averageProgress: { $ifNull: ["$averageProgress", 0] },
            completion: { $cond: [{ $gt: ["$totalStudents", 0] }, { $multiply: [{ $divide: ["$completionRate", "$totalStudents"] }, 100] }, 0] },
            thumbnail: "$thumbnailUrl",
        },
    },
  ]);
  ApiResponse.success(res, {
    totalStudents,
    newStudentsThisMonth:currentMonthEnrolledStudents,
    monthlyEnrollments,
    totalRevenue:totalRevenue[0]?.total || 0,
    totalReviews,
    revenueThisMonth: monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0,
    totalCourses,
    // monthlyRevenue,
    monthLabels: monthlyRevenue.map((m) => monthNames[m.month - 1] + " " + m.year),
    monthlyRevenue: monthlyRevenue.map((m) => m.revenue),
    enrollmentTrend: monthlyEnrollments.map((m) => m.count),
    publishedCourses,
    draftCourses,
    countryWiseEnrollments,
    recentReviews,
    avgCourseRating:averageRating[0]?.average || 0,
    topCourses: coursesWithTotalStudentRatingAndRevenue,
  });
});
const DUMMY = {
  completionRate: 67,
  avgQuizScore: 74,
  recentReviews: [
    {
      name: "Priya D.",
      course: "MERN Stack",
      rating: 5,
      text: "Absolutely brilliant! The real-world projects made all the difference.",
    },
    {
      name: "Rahul K.",
      course: "React.js",
      rating: 4,
      text: "Very well structured. Could use more advanced hook examples.",
    },
    {
      name: "Mehul J.",
      course: "Node.js",
      rating: 5,
      text: "Best backend course I have taken. Crystal clear explanations.",
    },
  ],
  dropOffData: [88, 75, 62, 54, 48, 41, 38],
  dropOffLabels: ["Intro", "Ch.2", "Ch.3", "Ch.4", "Ch.5", "Ch.6", "Ch.7"],
};