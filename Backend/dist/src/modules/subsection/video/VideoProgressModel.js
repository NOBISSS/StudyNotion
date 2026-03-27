import { model, Schema } from "mongoose";
const videoProgressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    videoId: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    duration: { type: Number, default: 0 },
    subSectionId: { type: Schema.Types.ObjectId, ref: "SubSection", required: true },
    isCompleted: { type: Boolean, default: false },
    currentTime: { type: Number, default: 0 },
    watchedPercentage: { type: Number, default: 0 },
}, { timestamps: true });
const VideoProgress = model("VideoProgress", videoProgressSchema);
export default VideoProgress;
//# sourceMappingURL=VideoProgressModel.js.map