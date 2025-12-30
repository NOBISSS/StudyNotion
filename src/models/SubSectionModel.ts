// subSection[color: Yellow] {
//     subSectionId string objectId pk
//     title string
//     contentType string enum["video","material","quiz"]
//     contentUrl string
//     videoLength string
//     materialType string
//   //   quiz string objectId fk
//     description string
//     thumbnailUrl string
//     courseId objectId fk
//     videoAssetId objectId fk
//     createdAt timestamp
//     updatedAt timestamp
//   }

import { model, Schema, Types } from "mongoose";

const subSectionSchema = new Schema({
    title: { type: String, required: true },
    contentType: {
        type: String,
        enum: ["video", "material", "quiz"],
        required: true,
    },
    contentUrl: { type: String, required: true },
    videoLength: { type: String },
    materialType: { type: String },
    description: { type: String },
    thumbnailUrl: { type: String },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    videoAssetId: { type: Types.ObjectId, ref: "VideoAsset" },
}, { timestamps: true });

export const SubSection = model("SubSection", subSectionSchema);