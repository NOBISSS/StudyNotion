import { model, Schema, Types } from "mongoose";

const sectionSchema = new Schema(
  {
    name: { type: String, required: true },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, required: true },
    subSectionIds: [{ type: Types.ObjectId, ref: "SubSection", default: [] }],
    isRemoved: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Section = model("Section", sectionSchema);
