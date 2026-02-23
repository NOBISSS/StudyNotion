import { model, Schema, Types } from "mongoose";

const subSectionSchema = new Schema({
    title: { type: String, required: true },
    contentType: {
        type: String,
        enum: ["video", "material", "quiz"],
        required: true,
    },
    // contentUrl: { type: String, required: true },
    // videoLength: { type: String },
    // materialType: { type: String },
    description: { type: String },
    // thumbnailUrl: { type: String },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    sectionId: { type: Types.ObjectId, ref: "Section", required: true },
    isActive: { type: Boolean, default: true },
    // videoAssetId: { type: Types.ObjectId, ref: "VideoAsset" },
}, { timestamps: true });

export const SubSection = model("SubSection", subSectionSchema);