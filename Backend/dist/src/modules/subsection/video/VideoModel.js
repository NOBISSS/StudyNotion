import { Schema, model } from "mongoose";
const VideoSchema = new Schema({
    videoName: String,
    tempVideoName: String,
    type: String,
    videoS3Key: { type: String, required: true },
    originalVideoS3Key: { type: String, required: true },
    tempVideoS3Key: { type: String },
    videoURL: { type: String },
    duration: Number,
    status: String,
    URLExpiration: Date,
    videoSize: Number,
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    subsectionId: {
        type: Schema.Types.ObjectId,
        ref: "SubSection",
        required: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    isActive: { type: Boolean, default: true },
    isNew: { type: Boolean, default: true },
}, {
    timestamps: true,
});
const Video = model("Video", VideoSchema);
export default Video;
//# sourceMappingURL=VideoModel.js.map