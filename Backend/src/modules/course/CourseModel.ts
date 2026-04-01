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
    totalDuration: { type: Number, default: 0 },
    totalLectures: { type: Number, default: 0 },
    totalMaterials: { type: Number, default: 0 },
    totalQuizzes: { type: Number, default: 0 },
    totalSubsections: { type: Number, default: 0 },
    totalDurationFormatted: { type: String, default: "0:00:00" },
    coursePlan: { type: Types.ObjectId, ref: "CoursePlan" },
    originalPrice: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    thumbnailUrl: { type: String },
    whatYouWillLearn: { type: [String], default: [] },
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
    scheduledPublishAt: { type: Date,default:null,index:true },
    isScheduled: { type: Boolean, default: false,index:true },
    scheduledJobId:{type:String,default:null},
    isBoosted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sections: [{ type: Types.ObjectId, ref: "Section" }],
  },
  { timestamps: true }
);

export const Course = model("Course", courseSchema);