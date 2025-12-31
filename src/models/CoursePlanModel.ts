import { Schema, model, Types } from "mongoose";
const coursePlanSchema = new Schema(
  {
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    instructorId: { type: Types.ObjectId, ref: "User", required: true },
    plan: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Available",
    },
    },
    { timestamps: true }
);

export const CoursePlan = model("CoursePlan", coursePlanSchema);