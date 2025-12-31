import { Types } from "mongoose";
import z from "zod";
import { Course } from "../models/CourseModel.js";
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
  instructorId: z.string({ error: "Instructor ID is required" }),
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
    const thumbnailImage = await uploadToCloudinary(
      Buffer.from(thumbnail.buffer)
    );
    const instructor = await User.findById(userId);
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
      courseName: courseName as string,
      description: description as string,
      instructorId: userId as Types.ObjectId,
      instructorName: `${instructor?.firstName} ${instructor?.lastName}`,
      categoryId: new Types.ObjectId(categoryId),
      typeOfCourse: typeOfCourse as "Free" | "Paid",
      coursePlan: coursePlan ? new Types.ObjectId(coursePlan) : null,
      originalPrice: price || 0,
      level: level as
        | "Beginner"
        | "Intermediate"
        | "Advance"
        | "Beginner-to-Advance",
      tag: tag || [],
      thumbnailUrl: thumbnailImage.secure_url,
    });

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
