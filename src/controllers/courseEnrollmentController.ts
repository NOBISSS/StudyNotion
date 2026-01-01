import { Types } from "mongoose";
import z from "zod";
import { CourseEnrollment } from "../models/CourseEnrollment.js";
import { Course } from "../models/CourseModel.js";
import { StatusCode, type Handler } from "../types.js";

export const EnrollInCourse: Handler = async (req, res) => {
  try {
    const userId = req.userId;
    const user = req.user;
    const parsedCourseData = z.string().safeParse(req.body.courseId);
    if (!parsedCourseData.success) {
      res.status(StatusCode.InputError).json({
        message:
          parsedCourseData.error.issues[0]?.message || "Invalid course Id",
      });
      return;
    }
    const courseId = parsedCourseData.data;
    const existingEnrollment = await CourseEnrollment.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });
    if (existingEnrollment) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "User is already enrolled in this course" });
      return;
    }
    const course = await Course.findById(new Types.ObjectId(courseId));

    if (course?.instructorId == userId && user?.accountType !== "admin") {
      res
        .status(StatusCode.InputError)
        .json({ message: "Instructor cannot enroll in their own course" });
      return;
    }
    const courseEnrollment = await CourseEnrollment.create({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });
    res.status(StatusCode.Success).json({
      message: "Course enrollment created successfully",
      courseEnrollment,
    });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
