import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { Course } from "../course/CourseModel.js";
import CourseProgress from "../course/CourseProgress.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";
import QuizAttempt from "../subsection/quiz/QuizAttemptModel.js";
import VideoProgress from "../subsection/video/VideoProgressModel.js";
import { UserStreak } from "../user/UserStreakModel.js";
import User from "../user/UserModel.js";
import { formatTimeAgo } from "../../shared/utils/formatTimeAgo.js";
import { SubSection } from "../subsection/SubSectionModel.js";
import { Category } from "../category/CategoryModel.js";
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
export const instructorDashboard = asyncHandler(async (req, res) => {
    const instructorId = req.userId;
    if (!instructorId)
        throw AppError.unauthorized("Instructor ID is required");
    const instructorCourses = await Course.find({
        instructorId,
        isActive: true,
    });
    const totalCourses = instructorCourses.length;
    const publishedCourses = instructorCourses.filter((c) => c.status === "Published").length;
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
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },
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
        totalStudents,
        newStudentsThisMonth: currentMonthEnrolledStudents,
        totalCourses,
        publishedCourses,
        draftCourses,
        totalRevenue: totalRevenueAgg[0]?.total || 0,
        revenueThisMonth: monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0,
        monthLabels: monthlyRevenue.map((m) => monthNames[m.month - 1] + " " + m.year),
        monthlyRevenue: monthlyRevenue.map((m) => m.revenue),
        enrollmentTrend: monthlyEnrollments.map((m) => m.count),
        completionRate: overAllCompletionRate[0]?.completionRate || 0,
        studentLocations: countryWiseEnrollments,
        totalReviews,
        recentReviews,
        avgCourseRating: averageRatingAgg[0]?.average || 0,
        topCourses: courses,
    });
});
const RequiredInstructorDashboardData = {
    avgQuizScore: 74,
    dropOffData: [88, 75, 62, 54, 48, 41, 38],
    dropOffLabels: ["Intro", "Ch.2", "Ch.3", "Ch.4", "Ch.5", "Ch.6", "Ch.7"],
};
export const studentDashboard = asyncHandler(async (req, res) => {
    const userId = req.userId;
    if (!userId)
        throw AppError.unauthorized("User ID is required");
    const userObjectId = new Types.ObjectId(userId);
    const enrollments = await CourseEnrollment.find({
        userId: userObjectId,
        isActive: true,
    }).lean();
    const courseIds = enrollments.map((e) => e.courseId);
    const totalCourses = enrollments.length;
    const allProgress = await CourseProgress.find({
        userId: userObjectId,
        courseId: { $in: courseIds },
    }).lean();
    const progressMap = new Map(allProgress.map((p) => [p.courseId.toString(), p]));
    const completedCourses = allProgress.filter((p) => p.completed).length;
    const hoursLearnedAgg = await VideoProgress.aggregate([
        { $match: { userId: userObjectId, isCompleted: true } },
        { $group: { _id: null, totalSeconds: { $sum: "$duration" } } },
        { $project: { _id: 0, totalSeconds: 1 } },
    ]);
    const hoursLearned = parseFloat(((hoursLearnedAgg[0]?.totalSeconds || 0) / 3600).toFixed(1));
    const quizAttempts = await QuizAttempt.find({ userId: userObjectId })
        .populate("quizId", "title")
        .sort({ attemptedAt: -1 })
        .lean();
    const avgQuizScore = quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((acc, q) => acc + q.score, 0) /
            quizAttempts.length)
        : 0;
    const quizHistory = quizAttempts.slice(0, 5).map((q) => ({
        name: q.quizId?.title || "Quiz",
        score: q.score,
        date: new Date(q.attemptedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
    }));
    const certificates = completedCourses;
    const streakDoc = await UserStreak.findOne({ userId: userObjectId }).lean();
    const streak = streakDoc?.currentStreak || 0;
    const rawWeekly = streakDoc?.weeklyActivity || [0, 0, 0, 0, 0, 0, 0];
    const todayDayIndex = new Date().getDay();
    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
        const dayOffset = (todayDayIndex - 6 + i + 7) % 7;
        return rawWeekly[dayOffset] || 0;
    });
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
    const lastVideoActivity = await VideoProgress.aggregate([
        { $match: { userId: userObjectId, courseId: { $in: courseIds } } },
        { $sort: { updatedAt: -1 } },
        { $group: { _id: "$courseId", lastAccessed: { $first: "$updatedAt" } } },
    ]);
    const lastAccessMap = new Map(lastVideoActivity.map((v) => [v._id.toString(), v.lastAccessed]));
    const enrolledCourses = enrollments
        .map((enrollment) => {
        const course = courseMap.get(enrollment.courseId.toString());
        if (!course)
            return null;
        const progress = progressMap.get(enrollment.courseId.toString());
        const lastAccessed = lastAccessMap.get(enrollment.courseId.toString());
        const progressPercentage = ((progress?.completedSubsections?.length || 0) / (totalLecturesMap.find((c) => c._id.toString() === course._id.toString())?.totalLectures || 1)) * 100;
        const isCompleted = progress?.completedSubsections?.length === (totalLecturesMap.find((c) => c._id.toString() === course._id.toString())?.totalLectures || 0);
        return {
            id: course._id,
            name: course.courseName,
            instructor: course.instructorName,
            thumbnail: course.thumbnailUrl,
            progress: Math.round(progressPercentage),
            completed: isCompleted,
            totalVideos: totalLecturesMap.find((c) => c._id.toString() === course._id.toString())?.totalLectures || 0,
            completedVideos: progress?.completedSubsections?.length || 0,
            lastAccessed: lastAccessed
                ? formatTimeAgo(lastAccessed)
                : "Not started",
        };
    })
        .filter(Boolean)
        .sort((a, b) => {
        const aTime = lastAccessMap.get(a.id.toString())?.getTime() || 0;
        const bTime = lastAccessMap.get(b.id.toString())?.getTime() || 0;
        return bTime - aTime;
    });
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
            type: "video",
            text: `Completed "${v.subSectionId?.title || "a lecture"}" in ${v.courseId?.courseName || "a course"}`,
            time: formatTimeAgo(v.updatedAt),
            timestamp: v.updatedAt,
        })),
        ...recentQuizzes.map((q) => ({
            type: "quiz",
            text: `Scored ${q.score}% on a quiz`,
            time: formatTimeAgo(q.attemptedAt),
            timestamp: q.attemptedAt,
        })),
        ...recentEnrollments.map((e) => ({
            type: "enroll",
            text: `Enrolled in ${e.courseId?.courseName || "a course"}`,
            time: formatTimeAgo(e.enrolledAt),
            timestamp: e.enrolledAt,
        })),
        ...allProgress
            .filter((p) => p.completed && p.completionDate)
            .map((p) => ({
            type: "cert",
            text: `Earned certificate for ${courseMap.get(p.courseId.toString())?.courseName || "a course"}`,
            time: formatTimeAgo(p.completionDate),
            timestamp: p.completionDate,
        })),
    ]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10)
        .map(({ timestamp, ...rest }) => rest);
    ApiResponse.success(res, {
        streak,
        totalCourses,
        completedCourses,
        hoursLearned,
        avgQuizScore,
        certificates,
        weeklyActivity,
        quizHistory,
        enrolledCourses,
        recentActivity,
    }, "Student dashboard retrieved successfully");
});
export const adminDashboard = asyncHandler(async (req, res) => {
    const userId = req.userId;
    if (!userId)
        throw AppError.unauthorized("User ID is required");
    const users = await User.find({ isDeleted: false }).lean();
    const totalUsers = users.length;
    const bannedUsers = users.filter((u) => u.isBanned).length;
    const instructorUsers = users.filter((u) => u.accountType === "instructor").length;
    const studentUsers = users.filter((u) => u.accountType === "student").length;
    const recentUsers = users;
    const courses = await Course.find().lean();
    const totalCourses = courses.length;
    const activeCourses = courses.filter((c) => c.isActive).length;
    const inactiveCourses = totalCourses - activeCourses;
    const publishedCourses = courses.filter((c) => c.isActive && c.status === "Published").length;
    const draftCourses = activeCourses - publishedCourses;
    const freeCourses = courses.filter((c) => c.typeOfCourse === "Free").length;
    const paidCourses = totalCourses - freeCourses;
    const categories = await Category.find().populate("courses").lean();
    const totalCategories = categories.length;
    ApiResponse.success(res, {
        users: {
            total: totalUsers,
            banned: bannedUsers,
            instructors: instructorUsers,
            students: studentUsers,
            recent: recentUsers.map((u) => ({
                id: u._id,
                name: u.firstName + " " + u.lastName,
                email: u.email,
                accountType: u.accountType,
                createdAt: u.createdAt,
            })),
        },
        courses: {
            total: totalCourses,
            active: activeCourses,
            inactive: inactiveCourses,
            published: publishedCourses,
            draft: draftCourses,
            free: freeCourses,
            paid: paidCourses,
        },
        categories: {
            total: totalCategories,
            list: categories.map((cat) => ({
                id: cat._id,
                name: cat.name,
                courseCount: cat.courses.length,
            })),
        },
    }, "Admin dashboard retrieved successfully");
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
            thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=200&q=60",
            lastAccessed: "2h ago",
            totalVideos: 48,
            completedVideos: 39,
        },
        {
            id: 2,
            name: "React.js from Scratch",
            instructor: "Arafat Mansuri",
            progress: 55,
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=60",
            lastAccessed: "1d ago",
            totalVideos: 32,
            completedVideos: 18,
        },
        {
            id: 3,
            name: "JavaScript Fundamentals",
            instructor: "Arafat Mansuri",
            progress: 100,
            thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=200&q=60",
            lastAccessed: "3d ago",
            totalVideos: 24,
            completedVideos: 24,
        },
        {
            id: 4,
            name: "Node.js & Express",
            instructor: "Arafat Mansuri",
            progress: 28,
            thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=60",
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
//# sourceMappingURL=dashboardController.js.map