import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import type { Handler } from "../../shared/types.js";
import { Course } from "../course/CourseModel.js";
import CourseProgress from "../course/CourseProgress.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";
import QuizAttempt from "../subsection/quiz/QuizAttemptModel.js";
import VideoProgress from "../subsection/video/VideoProgressModel.js";
import { UserStreak } from "../user/UserStreakModel.js";
import { formatTimeAgo } from "../../shared/utils/formatTimeAgo.js";
import { SubSection } from "../subsection/SubSectionModel.js";
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
  if (!userId) throw AppError.unauthorized("User ID is required");

  const userObjectId = new Types.ObjectId(userId);

  // ── Enrollments ───────────────────────────────────────────────────────────
  const enrollments = await CourseEnrollment.find({
    userId: userObjectId,
    isActive: true,
  }).lean();

  const courseIds = enrollments.map((e) => e.courseId);
  const totalCourses = enrollments.length;

  // ── Course Progress ───────────────────────────────────────────────────────
  const allProgress = await CourseProgress.find({
    userId: userObjectId,
    courseId: { $in: courseIds },
  }).lean();

  const progressMap = new Map(
    allProgress.map((p) => [p.courseId.toString(), p]),
  );

  const completedCourses = allProgress.filter((p) => p.completed).length;

  // ── Hours Learned (from VideoProgress) ───────────────────────────────────
  const hoursLearnedAgg = await VideoProgress.aggregate([
    { $match: { userId: userObjectId, isCompleted: true } },
    { $group: { _id: null, totalSeconds: { $sum: "$duration" } } },
    { $project: { _id: 0, totalSeconds: 1 } },
  ]);
  const hoursLearned = parseFloat(
    ((hoursLearnedAgg[0]?.totalSeconds || 0) / 3600).toFixed(1),
  );

  // ── Quiz Stats ────────────────────────────────────────────────────────────
  const quizAttempts = await QuizAttempt.find({ userId: userObjectId })
    .populate("quizId", "title")
    .sort({ attemptedAt: -1 })
    .lean();

  const avgQuizScore =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((acc, q) => acc + q.score, 0) /
            quizAttempts.length,
        )
      : 0;

  // Last 5 quiz attempts for the chart
  const quizHistory = quizAttempts.slice(0, 5).map((q) => ({
    name: (q.quizId as any)?.title || "Quiz",
    score: q.score,
    date: new Date(q.attemptedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  // ── Certificates ──────────────────────────────────────────────────────────
  // Certificate model not implemented yet — derive from completed courses
  const certificates = completedCourses;

  // ── Streak & Weekly Activity ──────────────────────────────────────────────
  const streakDoc = await UserStreak.findOne({ userId: userObjectId }).lean();
  const streak = streakDoc?.currentStreak || 0;

  // weeklyActivity: shift so index 0 = 6 days ago, index 6 = today
  const rawWeekly = streakDoc?.weeklyActivity || [0, 0, 0, 0, 0, 0, 0];
  // Rotate so the array always represents Mon→Sun relative to today
  const todayDayIndex = new Date().getDay(); // 0=Sun, 6=Sat
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const dayOffset = (todayDayIndex - 6 + i + 7) % 7;
    return rawWeekly[dayOffset] || 0;
  });

  // ── Enrolled Courses with Progress ───────────────────────────────────────
  const courses = await Course.find({
    _id: { $in: courseIds },
    isActive: true,
    status: "Published",
  }).lean();
  const totalLecturesMap = await SubSection.aggregate([
    { $match: { courseId: { $in: courseIds }, isActive: true } },
    { $group: { _id: "$courseId", totalLectures: { $sum: 1 } } },
  ]);
  const courseMap = new Map(courses.map((c) => [c._id.toString(), c]));

  // Get last video activity per course for "lastAccessed"
  const lastVideoActivity = await VideoProgress.aggregate([
    { $match: { userId: userObjectId, courseId: { $in: courseIds } } },
    { $sort: { updatedAt: -1 } },
    { $group: { _id: "$courseId", lastAccessed: { $first: "$updatedAt" } } },
  ]);
  const lastAccessMap = new Map(
    lastVideoActivity.map((v) => [v._id.toString(), v.lastAccessed]),
  );

  const enrolledCourses = enrollments
    .map((enrollment) => {
      const course = courseMap.get(enrollment.courseId.toString());
      if (!course) return null;

      const progress = progressMap.get(enrollment.courseId.toString());
      const lastAccessed = lastAccessMap.get(enrollment.courseId.toString());
      const progressPercentage = ((progress?.completedSubsections?.length || 0) / (totalLecturesMap.find((c) => c._id.toString() === course._id.toString())?.totalLectures || 1)) * 100;
      return {
        id: course._id,
        name: course.courseName,
        instructor: course.instructorName,
        thumbnail: course.thumbnailUrl,
        progress: Math.round(progressPercentage),
        completed: progress?.completed || false,
        totalVideos: totalLecturesMap[0]?.totalLectures || 0,
        completedVideos: progress?.completedSubsections?.length || 0,
        lastAccessed: lastAccessed
          ? formatTimeAgo(lastAccessed)
          : "Not started",
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by lastAccessed — most recent first
      const aTime = lastAccessMap.get(a!.id.toString())?.getTime() || 0;
      const bTime = lastAccessMap.get(b!.id.toString())?.getTime() || 0;
      return bTime - aTime;
    });

  // ── Recent Activity ───────────────────────────────────────────────────────
  // Pull from VideoProgress, QuizAttempt, CourseEnrollment and merge + sort
  const [recentVideos, recentQuizzes, recentEnrollments] = await Promise.all([
    VideoProgress.find({ userId: userObjectId, isCompleted: true })
      .populate("subSectionId", "title")
      .populate("courseId", "courseName")
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean(),

    QuizAttempt.find({ userId: userObjectId })
      .sort({ attemptedAt: -1 })
      .limit(5)
      .lean(),

    CourseEnrollment.find({ userId: userObjectId, isActive: true })
      .populate("courseId", "courseName")
      .sort({ enrolledAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const recentActivity = [
    ...recentVideos.map((v) => ({
      type: "video" as const,
      text: `Completed "${(v.subSectionId as any)?.title || "a lecture"}" in ${(v.courseId as any)?.courseName || "a course"}`,
      time: formatTimeAgo(v.updatedAt),
      timestamp: v.updatedAt,
    })),
    ...recentQuizzes.map((q) => ({
      type: "quiz" as const,
      text: `Scored ${q.score}% on a quiz`,
      time: formatTimeAgo(q.attemptedAt),
      timestamp: q.attemptedAt,
    })),
    ...recentEnrollments.map((e) => ({
      type: "enroll" as const,
      text: `Enrolled in ${(e.courseId as any)?.courseName || "a course"}`,
      time: formatTimeAgo(e.enrolledAt),
      timestamp: e.enrolledAt,
    })),
    // Certificates from completed courses
    ...allProgress
      .filter((p) => p.completed && p.completionDate)
      .map((p) => ({
        type: "cert" as const,
        text: `Earned certificate for ${courseMap.get(p.courseId.toString())?.courseName || "a course"}`,
        time: formatTimeAgo(p.completionDate!),
        timestamp: p.completionDate!,
      })),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 10)
    .map(({ timestamp, ...rest }) => rest); // strip internal timestamp field

  // ── Response ──────────────────────────────────────────────────────────────
  ApiResponse.success(
    res,
    {
      // Stats
      streak,
      totalCourses,
      completedCourses,
      hoursLearned,
      avgQuizScore,
      certificates,

      // Charts
      weeklyActivity,
      quizHistory,

      // Lists
      enrolledCourses,
      recentActivity,
    },
    "Student dashboard retrieved successfully",
  );
});

const RequiredStudentDashboardData = {
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