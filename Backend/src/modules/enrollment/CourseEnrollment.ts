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
    isActive: {
      type: Boolean,
      default: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    instructorId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const CourseEnrollment = model(
  "CourseEnrollment",
  CourseEnrollmentSchema
);
