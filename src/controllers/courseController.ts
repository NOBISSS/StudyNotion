import type { UploadApiResponse } from "cloudinary";
import { Types } from "mongoose";
import z from "zod";
import { Category } from "../models/CategoryModel.js";
import { CourseEnrollment } from "../models/CourseEnrollment.js";
import { Course } from "../models/CourseModel.js";
import { RatingAndReview } from "../models/RatingAndReview.js";
import { Section } from "../models/SectionModel.js";
import User from "../models/UserModel.js";
import { StatusCode, type Handler } from "../types.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

const courseInputSchema = z.object({
  courseName: z
    .string({ error: "Course name is required" })
    .min(3, { error: "Course name must be at least 3 characters long" })
    .max(100, { error: "Course name must be at most 100 characters long" }),
  description: z
    .string({ error: "Description is required" })
    .min(10, { error: "Description must be at least 10 characters long" })
    .max(1000, { error: "Description must be at most 1000 characters long" }),
  categoryId: z.string({ error: "Category ID is required" }),
  typeOfCourse: z.enum(["Free", "Paid"], {
    error: "Type of course must be either Free or Paid",
  }),
  coursePlan: z.string().optional(),
  price: z
    .number({ error: "Price is required" })
    .min(0, { error: "Price cannot be negative" })
    .optional(),
  // thumbnailUrl: z
  //   .url({ error: "Thumbnail URL must be a valid URL" })
  //   .optional(),
  level: z.enum(
    ["Beginner", "Intermediate", "Advance", "Beginner-to-Advance"],
    {
      error:
        "Level must be one of Beginner, Intermediate, Advance, or Beginner-to-Advance",
    }
  ),
  tag: z.array(z.string()).optional(),
});

export const createCourse: Handler = async (req, res) => {
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
    console.log("Thubnail found");
    let thumbnailImage: UploadApiResponse;
    try {
      thumbnailImage = await uploadToCloudinary(Buffer.from(thumbnail.buffer));
    } catch (err) {
      res.status(StatusCode.ServerError).json({
        message:
          "Something went wrong from our side while uploading the thumbnail image",
        error: err,
      });
      return;
    }
    console.log("Thumbnail Image uploaded");
    const instructor = await User.findById(userId);
    if (!instructor) {
      res.status(StatusCode.NotFound).json({ message: "Instructor not found" });
      return;
    }
    console.log("Instructor found");
    if (
      instructor.accountType !== "instructor" &&
      instructor.accountType !== "admin"
    ) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "User is not authorized to create a course" });
      return;
    }
    console.log("Authorization complete");
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
    console.log("Course Data:", parsedCourseData.data);
    const course = await Course.create({
      courseName,
      description,
      instructorId: userId as Types.ObjectId,
      instructorName: `${instructor?.firstName} ${instructor?.lastName}`,
      categoryId,
      typeOfCourse,
      coursePlan: coursePlan ? new Types.ObjectId(coursePlan) : null,
      originalPrice: price || 0,
      level,
      tag: tag || [],
      thumbnailUrl: thumbnailImage.secure_url,
    });
    console.log("Course created");
    await Category.findByIdAndUpdate(categoryId, {
      $push: { courses: course._id },
    });
    console.log("Category created");
    await Section.create({
      name: "Introduction",
      courseId: course._id,
      order: 1,
      subSectionIds: [],
    });
    console.log("Reached End");
    res
      .status(StatusCode.Success)
      .json({ message: "Course created successfully", course });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
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
  res
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
      }))
    );
    const sortedCourses = coursesWithEnrollmentCount.slice().sort((a, b) => {
      if (b.enrollmentsCount === a.enrollmentsCount) {
        return b.ratingsAverage - a.ratingsAverage;
      }
      return b.enrollmentsCount - a.enrollmentsCount;
    });
    res
      .status(StatusCode.Success)
      .json({
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
