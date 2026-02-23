import type { UploadApiResponse } from "cloudinary";
import { Types } from "mongoose";
import { StatusCode, type Handler } from "../../shared/types.js";
import { uploadToCloudinary } from "../../shared/utils/cloudinaryUpload.js";
import { Category } from "../category/CategoryModel.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";
import { Section } from "../section/SectionModel.js";
import User from "../user/UserModel.js";
import { Course } from "./CourseModel.js";
import { courseInputSchema } from "./courseValidation.js";

export const createCourse: Handler = async (req, res) => {
  let thumbnailImage: UploadApiResponse;
  try {
    const userId = req.userId;
    const parsedCourseData = courseInputSchema.safeParse(req.body);
    if (!parsedCourseData.success) {
      res.status(StatusCode.InputError).json({
        message:
          parsedCourseData.error.issues[0]?.message || "Invalid course data",
      });
      return;
    }
    const thumbnail = req.file;
    if (!thumbnail) {
      res
        .status(StatusCode.InputError)
        .json({ message: "Thumbnail image is required" });
      return;
    }
    
    try {
      console.log("Received thumbnail file:", thumbnail.originalname, "Size:", thumbnail.size);
      console.log("Thumbnail file buffer type:", typeof thumbnail.buffer);
      thumbnailImage = await uploadToCloudinary(Buffer.from(thumbnail.buffer));
    } catch (err) {
      res.status(StatusCode.ServerError).json({
        message:
          "Something went wrong from our side while uploading the thumbnail image",
        error: err,
        //@ts-ignore
        err: thumbnailImage
      });
      return;
    }
    const instructorId = req.accountType === "instructor" ? userId : parsedCourseData.data.instructorId;
    if (!instructorId) {
      res.status(StatusCode.InputError).json({
        message: "Instructor ID is required for course creation",
      });
      return;
    }
    const instructor = await User.findById(instructorId);
    if (!instructor) {
      res.status(StatusCode.NotFound).json({ message: "Instructor not found" });
      return;
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
      slug:
        courseName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") + `-${Date.now()}`,
    });
    await Category.findByIdAndUpdate(categoryId, {
      $push: { courses: course._id },
    });
    await Section.create({
      name: "Introduction",
      courseId: course._id,
      order: 1,
      subSectionIds: [],
    });
    res
      .status(StatusCode.Success)
      .json({ message: "Course created successfully", course });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err,
        //@ts-ignore 
        thumbnailImage });
    return;
  }
};
export const getAllCourse: Handler = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find();
    res
      .status(StatusCode.Success)
      .json({ message: "Courses retrieved successfully", courses });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const getAllCourseByEnrollmentsAndRatings: Handler = async (
  req,
  res,
) => {
  try {
    const userId = req.userId;
    const courses = await Course.find();
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
    res.status(StatusCode.Success).json({
      message: "Courses retrieved successfully",
      courses,
      sortedCourses,
    });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const getAllCourseByEnrollmentsAndRatingsAndCategory: Handler = async (
  req,
  res,
) => {
  try {
    const userId = req.userId;
    const categoryId = req.params.categoryId;
    const courses = await Course.find({
      categoryId: new Types.ObjectId(categoryId),
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
    res.status(StatusCode.Success).json({
      message: "Courses retrieved successfully",
      courses,
      sortedCourses,
    });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const deleteCourse: Handler = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(StatusCode.NotFound).json({ message: "Course not found" });
      return;
    }
    if (course.instructorId !== req.userId) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "You are not authorized to delete this course" });
      return;
    }
    course.isActive = false;
    await course.save({ validateBeforeSave: false });
    await RatingAndReview.updateMany(
      { courseId: new Types.ObjectId(courseId) },
      { isActive: false },
    );
    res
      .status(StatusCode.Success)
      .json({ message: "Course deleted successfully" });
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const updateCourse: Handler = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (courseId && !Types.ObjectId.isValid(courseId as string)) {
      res.status(StatusCode.InputError).json({ message: "Invalid course ID" });
      return;
    }
    const parsedCourseData = courseInputSchema.safeParse(req.body);
    if (!parsedCourseData.success) {
      res.status(StatusCode.InputError).json({
        message:
          parsedCourseData.error.issues[0]?.message || "Invalid course data",
      });
      return;
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
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(StatusCode.NotFound).json({ message: "Course not found" });
      return;
    }
    if (course.instructorId !== req.userId) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "You are not authorized to update this course" });
      return;
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
    res
      .status(StatusCode.Success)
      .json({ message: "Course updated successfully" });
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
