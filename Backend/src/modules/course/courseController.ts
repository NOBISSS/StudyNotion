import type { UploadApiResponse } from "cloudinary";
import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { uploadToCloudinary } from "../../shared/utils/cloudinaryUpload.js";
import { Category } from "../category/CategoryModel.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";
import { Section } from "../section/SectionModel.js";
import User from "../user/UserModel.js";
import { Course } from "./CourseModel.js";
import { courseInputSchema } from "./courseValidation.js";
import type { Handler } from "../../shared/types.js";
import { SubSection } from "../subsection/SubSectionModel.js";
import { Material } from "../subsection/material/MaterialModel.js";
import { Quiz } from "../subsection/quiz/QuizModel.js";
import Video from "../subsection/video/VideoModel.js";

export const createCourse = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const parsedCourseData = courseInputSchema.safeParse(req.body);
  if (!parsedCourseData.success) {
    throw AppError.badRequest(
      parsedCourseData.error.issues[0]?.message || "Invalid course data",
    );
  }
  const thumbnail = req.file;
  if (!thumbnail) {
    throw AppError.badRequest("Thumbnail image is required");
  }
  let thumbnailImage: UploadApiResponse | null = null;
  try {
    thumbnailImage = await uploadToCloudinary(
      thumbnail.buffer,
      "StudyNotion/Thumbnails",
    );
    if (!thumbnailImage) {
      throw AppError.internal("Failed to upload thumbnail image");
    }
  } catch (err) {
    throw AppError.internal(
      "Something went wrong from our side while uploading the thumbnail image",
    );
  }
  const instructorId =
    req.accountType === "instructor"
      ? userId
      : parsedCourseData.data.instructorId;
  if (!instructorId) {
    throw AppError.badRequest("Instructor ID is required for course creation");
  }
  const instructor = await User.findById(instructorId);
  if (!instructor) {
    throw AppError.notFound("Instructor not found");
  }
  const {
    categoryId,
    courseName,
    description,
    typeOfCourse,
    coursePlan,
    price,
    level,
    tag,
    whatYouWillLearn,
  } = parsedCourseData.data;
  const course = await Course.create({
    courseName,
    description,
    instructorId: new Types.ObjectId(instructorId),
    instructorName: `${instructor?.firstName} ${instructor?.lastName}`,
    categoryId,
    typeOfCourse,
    coursePlan: coursePlan ? new Types.ObjectId(coursePlan) : null,
    originalPrice: price || 0,
    level,
    tag: tag || [],
    thumbnailUrl: thumbnailImage.secure_url,
    slug: `${instructor?.firstName} ${instructor?.lastName}/${courseName}`,
    whatYouWillLearn: whatYouWillLearn || [],
  });
  await Category.findByIdAndUpdate(categoryId, {
    $push: { courses: course._id },
  });
  // await Section.create({
  //   name: "Introduction",
  //   courseId: course._id,
  //   order: 1,
  //   subSectionIds: [],
  // });
  ApiResponse.created(res, { course }, "Course created successfully");
});
export const createCourseWithThumbnailURL = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const parsedCourseData = courseInputSchema.safeParse(req.body);
  if (!parsedCourseData.success) {
    throw AppError.badRequest(
      parsedCourseData.error.issues[0]?.message || "Invalid course data",
    );
  }
  const instructorId =
    req.accountType === "instructor"
      ? userId
      : parsedCourseData.data.instructorId;
  if (!instructorId) {
    throw AppError.badRequest("Instructor ID is required for course creation");
  }
  const instructor = await User.findById(instructorId);
  if (!instructor) {
    throw AppError.notFound("Instructor not found");
  }
  const {
    categoryId,
    courseName,
    description,
    typeOfCourse,
    coursePlan,
    price,
    level,
    tag,
    thumbnailUrl,
    whatYouWillLearn,
  } = parsedCourseData.data;
  if (!thumbnailUrl) {
    throw AppError.badRequest("Thumbnail URL is required for course creation");
  }
  const course = await Course.create({
    courseName,
    description,
    instructorId: new Types.ObjectId(instructorId),
    instructorName: `${instructor?.firstName} ${instructor?.lastName}`,
    categoryId,
    typeOfCourse,
    coursePlan: coursePlan ? new Types.ObjectId(coursePlan) : null,
    originalPrice: price || 0,
    level,
    tag: tag || [],
    thumbnailUrl,
    slug:
      courseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Date.now()}`,
    whatYouWillLearn: whatYouWillLearn || [],
  });
  await Category.findByIdAndUpdate(categoryId, {
    $push: { courses: course._id },
  });
  // await Section.create({
  //   name: "Introduction",
  //   courseId: course._id,
  //   order: 1,
  //   subSectionIds: [],
  // });
  ApiResponse.created(res, { course }, "Course created successfully");
});
export const getAllCourse = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isActive: true });
  ApiResponse.success(
    res,
    {
      courses,
    },
    "Courses retrieved successfully",
  );
});
export const getAllCourseByEnrollmentsAndRatings = asyncHandler(
  async (req, res) => {
    const userId = req.userId;
    const courses = await Course.find({ isActive: true }).populate("categoryId", "name");
    const coursesWithEnrollmentCount = await Promise.all(
      courses.map(async (c) => ({
        ...c.toObject(),
        enrollmentsCount: await CourseEnrollment.countDocuments({
          courseId: c._id,
        }),
        ratingsAverage: await RatingAndReview.aggregate([
          { $match: { courseId: c._id } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
            },
          },
          { $project: { _id: 0, averageRating: 1 } },
        ]).then((result) => Number(result[0]?.averageRating) || 0),
        isEnrolled: (await CourseEnrollment.exists({
          courseId: c._id,
          userId: new Types.ObjectId(userId),
        }))
          ? true
          : false,
      })),
    );
    const sortedCourses = coursesWithEnrollmentCount.slice().sort((a, b) => {
      if (b.enrollmentsCount === a.enrollmentsCount) {
        return b.ratingsAverage - a.ratingsAverage;
      }
      return b.enrollmentsCount - a.enrollmentsCount;
    });
    ApiResponse.success(
      res,
      {
        courses,
        sortedCourses,
      },
      "Courses retrieved successfully",
    );
  },
);
export const getAllCourseByEnrollmentsAndRatingsAndCategory:Handler = asyncHandler(
  async (req, res) => {
    const userId = req.userId;
    const categoryId = req.params.categoryId;
    const courses = await Course.find({
      categoryId: new Types.ObjectId(categoryId),
      isActive: true,
    });
    const coursesWithEnrollmentCount = await Promise.all(
      courses.map(async (c) => ({
        ...c.toObject(),
        enrollmentsCount: await CourseEnrollment.countDocuments({
          courseId: c._id,
        }),
        ratingsAverage: await RatingAndReview.aggregate([
          { $match: { courseId: c._id } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
            },
          },
          { $project: { _id: 0, averageRating: 1 } },
        ]).then((result) => Number(result[0]?.averageRating) || 0),
        isEnrolled: (await CourseEnrollment.exists({
          courseId: c._id,
          userId: new Types.ObjectId(userId),
        }))
          ? true
          : false,
      })),
    );
    const sortedCourses = coursesWithEnrollmentCount.slice().sort((a, b) => {
      if (b.enrollmentsCount === a.enrollmentsCount) {
        return b.ratingsAverage - a.ratingsAverage;
      }
      return b.enrollmentsCount - a.enrollmentsCount;
    });
    ApiResponse.success(
      res,
      {
        courses,
        sortedCourses,
      },
      "Courses retrieved successfully",
    );
  },
);
export const deleteCourse:Handler = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (!course) {
    throw AppError.notFound("Course not found");
  }
  if (course.instructorId !== req.userId) {
    throw AppError.unauthorized("You are not authorized to delete this course");
  }
  course.isActive = false;
  await course.save({ validateBeforeSave: false });
  await RatingAndReview.updateMany(
    { courseId: new Types.ObjectId(courseId) },
    { isActive: false },
  );
  await CourseEnrollment.updateMany(
    { courseId: new Types.ObjectId(courseId) },
    { isActive: false },
  );
  await Section.updateMany(
    { courseId: new Types.ObjectId(courseId) },
    { isRemoved: true },
  );
  await Category.findByIdAndUpdate(course.categoryId, {
    $pull: { courses: course._id },
  });
  await SubSection.updateMany(
    { courseId: new Types.ObjectId(courseId) },
    { isActive: false },
  );
  await Material.updateMany(
    { courseId: new Types.ObjectId(courseId) },
    { isActive: false },
  );
  await Quiz.updateMany(
    { courseId: new Types.ObjectId(courseId) },
    { isActive: false },
  );
  await Video.updateMany(
    { courseId: new Types.ObjectId(courseId) },
    { isActive: false },
  );
  ApiResponse.success(res, {}, "Course deleted successfully");
});
export const updateCourse:Handler = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  if (courseId && !Types.ObjectId.isValid(courseId as string)) {
    throw AppError.badRequest("Invalid course ID");
  }
  const parsedCourseData = courseInputSchema.safeParse(req.body);
  if (!parsedCourseData.success) {
    throw AppError.badRequest("Invalid course data");
  }
  const {
    courseName,
    description,
    typeOfCourse,
    coursePlan,
    price,
    level,
    tag,
  } = parsedCourseData.data;
  const course = await Course.findOne({ _id: new Types.ObjectId(courseId), isActive: true });
  if (!course) {
    throw AppError.notFound("Course not found");
  }
  if (course.instructorId !== req.userId) {
    throw AppError.unauthorized("You are not authorized to update this course");
  }
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      courseName,
      description,
      typeOfCourse,
      coursePlan: coursePlan ? new Types.ObjectId(coursePlan) : null,
      originalPrice: price || 0,
      level,
      tag: tag || [],
    },
    { new: true, runValidators: true },
  );
  ApiResponse.success(
    res,
    { course: updatedCourse },
    "Course updated successfully",
  );
});
export const getCourseDetails:Handler = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.userId;
  if (courseId && !Types.ObjectId.isValid(courseId as string)) {
    throw AppError.badRequest("Invalid course ID");
  }
  const course = await Course.findOne({ _id: new Types.ObjectId(courseId), isActive: true }).populate("categoryId", "name");
  if (!course) {
    throw AppError.notFound("Course not found");
  }
  const sections = await Section.find({
    courseId: new Types.ObjectId(courseId),
    isRemoved: false,
  });
  const enrollmentsCount = await CourseEnrollment.countDocuments({
    courseId: new Types.ObjectId(courseId),
  });
  const reviews = await RatingAndReview.find({
    courseId: new Types.ObjectId(courseId),
    isActive: true,
  }).populate("userId", "firstName lastName profilePicture");
  const isUserEnrolled = await CourseEnrollment.findOne({
    courseId: new Types.ObjectId(courseId),
    userId: new Types.ObjectId(userId || ""),
  });
  ApiResponse.success(
    res,
    { course, sections, enrollmentsCount, reviews, isUserEnrolled: !!isUserEnrolled },
    "Course details retrieved successfully",
  );
});
export const searchCourses:Handler = asyncHandler(async (req, res) => {
  const { search } = req.query;
  if (!search || typeof search !== "string") {
    throw AppError.badRequest("Search search is required");
  }
  const courses = await Course.find({
    courseName: { $regex: search, $options: "i" },
    isActive: true,
  });
  ApiResponse.success(
    res,
    {
      courses,
    },
    "Search results retrieved successfully",
  );
});