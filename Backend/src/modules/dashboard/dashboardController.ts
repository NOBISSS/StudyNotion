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
const RequiredInstructorDashboardData = {
  avgQuizScore: 74,
  dropOffData: [88, 75, 62, 54, 48, 41, 38],
  dropOffLabels: ["Intro", "Ch.2", "Ch.3", "Ch.4", "Ch.5", "Ch.6", "Ch.7"],
};
export const studentDashboard: Handler = asyncHandler(async (req, res) => {
  const userId = req.userId;
  if(!userId) throw AppError.unauthorized("User ID is required");

  const totalCourses = await CourseEnrollment.countDocuments({ userId, isActive: true });
  const completedCourses = await CourseProgress.countDocuments({ userId, completed: true });
  const hoursLearnedAgg = await CourseProgress.aggregate([
    { $match: { userId } },
    { $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course"
    }},
    { $unwind: "$course" },
    { $group: {
        _id: null,
        totalHours: { $sum: "$course.totalHours" }
    }},
    { $project: { _id: 0, totalHours: 1 } }
  ]);
  const hoursLearned = hoursLearnedAgg[0]?.totalHours || 0;
  const enrolledCourses = await CourseEnrollment.find({ userId, isActive: true })
    .populate("courseId", "courseName instructorId instructorName thumbnailUrl")
    .sort({ enrolledAt: -1 })
  ApiResponse.success(res, {
    totalCourses,
    completedCourses,
    hoursLearned,
    enrolledCourses
  });
});

const RequiredStudentDashboardData = {
  name: "Aryan Mehta",
  streak: 12,
  totalCourses: 6,
  completedCourses: 2,
  hoursLearned: 47,
  avgQuizScore: 78,
  certificates: 2,
  enrolledCourses: [
    {
      id: 1,
      name: "Complete MERN Stack",
      instructor: "Arafat Mansuri",
      progress: 82,
      thumbnail:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&q=60",
      lastAccessed: "2h ago",
      totalVideos: 48,
      completedVideos: 39,
    },
    {
      id: 2,
      name: "React.js from Scratch",
      instructor: "Arafat Mansuri",
      progress: 55,
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=60",
      lastAccessed: "1d ago",
      totalVideos: 32,
      completedVideos: 18,
    },
    {
      id: 3,
      name: "JavaScript Fundamentals",
      instructor: "Arafat Mansuri",
      progress: 100,
      thumbnail:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=200&q=60",
      lastAccessed: "3d ago",
      totalVideos: 24,
      completedVideos: 24,
    },
    {
      id: 4,
      name: "Node.js & Express",
      instructor: "Arafat Mansuri",
      progress: 28,
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=60",
      lastAccessed: "5d ago",
      totalVideos: 40,
      completedVideos: 11,
    },
  ],
  weeklyActivity: [2.5, 1.0, 3.5, 0.5, 4.0, 2.0, 1.5],
  quizHistory: [
    { name: "JS Basics", score: 85, date: "Jan 5" },
    { name: "React Hooks", score: 72, date: "Jan 8" },
    { name: "Node APIs", score: 68, date: "Jan 11" },
    { name: "MongoDB", score: 90, date: "Jan 14" },
    { name: "Express MW", score: 76, date: "Jan 17" },
  ],
  recentActivity: [
    {
      type: "video",
      text: 'Completed "JWT Authentication" in Node.js',
      time: "2h ago",
    },
    { type: "quiz", text: "Scored 90% on MongoDB Quiz", time: "5h ago" },
    {
      type: "enroll",
      text: "Enrolled in Node.js & Express Backend Mastery",
      time: "1d ago",
    },
    {
      type: "cert",
      text: "Earned certificate for JavaScript Fundamentals",
      time: "3d ago",
    },
  ],
};