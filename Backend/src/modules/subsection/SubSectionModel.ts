import { model, Schema, Types } from "mongoose";

const subSectionSchema = new Schema({
    title: { type: String, required: true },
    contentType: {
        type: String,
        enum: ["video", "material", "quiz"],
        required: true,
    },
    isPreview: { type: Boolean, default: false },
    description: { type: String },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    sectionId: { type: Types.ObjectId, ref: "Section", required: true },
    isActive: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: false },
}, { timestamps: true });

export const SubSection = model("SubSection", subSectionSchema);