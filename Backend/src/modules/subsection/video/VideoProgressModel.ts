// videoProgress{
//     videoProgressId ObjectId pk
//     userId ObjectId fk
//     videoId ObjectId fk
//     courseId ObjectId fk
//     subSectionId ObjectId fk
//     isCompleted boolean
//     currentTime: Number,   // seconds
//     watchedPercentage number // 0-100
//     updatedAt timestamp
//   }

import { model, Schema } from "mongoose";

const videoProgressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    videoId: { type: Schema.Types.ObjectId, ref: "Video", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    duration: { type: Number, default: 0 }, // in seconds
    subSectionId: { type: Schema.Types.ObjectId, ref: "SubSection", required: true },
    isCompleted: { type: Boolean, default: false },
    currentTime: { type: Number, default: 0 }, // in seconds
    watchedPercentage: { type: Number, default: 0 }, // 0-100
}, { timestamps: true });

const VideoProgress = model("VideoProgress", videoProgressSchema);

export default VideoProgress;