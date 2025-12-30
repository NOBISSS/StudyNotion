// section [icon: home] {
//     sectionId objectId
//     name String
//     courseId string objectId fk
//   //   sectionContent string array
//     order number
//     subSectionIds [objectId] fk
//     createdAt Date
//     updatedAt Date
//   }
import { model, Schema, Types } from "mongoose";

const sectionSchema = new Schema(
  {
    name: { type: String, required: true },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, required: true },
    subSectionIds: [{ type: Types.ObjectId, ref: "SubSection", default: [] }],
  },
  { timestamps: true }
);
export const Section = model("Section", sectionSchema);
