import { Schema, model, Types } from "mongoose";

const courseSchema = new Schema(
  {
    courseName: { type: String, required: true },
    instructorName: { type: String, required: true },
    description: { type: String, required: true },
    instructorId: { type: Types.ObjectId, ref: "User", required: true },
    typeOfCourse: {
      type: String,
      enum: ["Free", "Paid"],
      required: true,
    },
    coursePlan: { type: Types.ObjectId, ref: "CoursePlan" },
    originalPrice: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    thumbnailUrl: { type: String },
    tag: { type: [String], default: [] },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advance", "Beginner-to-Advance"],
        required: true,
    },
    status: {
      type: String,
        enum: ["Draft", "Published"],
        default: "Draft",
    },
    isBoosted: { type: Boolean, default: false },
    sections: [{ type: Types.ObjectId, ref: "Section" }],
  },
  { timestamps: true }
);

export const Course = model("Course", courseSchema);