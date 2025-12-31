import { model, Schema, Types } from "mongoose";

const CourseEnrollmentSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    courseId: {
      type: Types.ObjectId,
      required: true,
      ref: "Course",
    },
  },
  { timestamps: true }
);

export const CourseEnrollment = model(
  "CourseEnrollment",
  CourseEnrollmentSchema
);
