import { model, Schema, Types } from "mongoose";
const courseProgressSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
    },
    progress: {
        type: Number,
        default: 0,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completionDate: {
        type: Date,
    },
    courseId: {
        type: Types.ObjectId,
        ref: "Course",
        required: true,
    },
    completedSubsections: [
        {
            type: Types.ObjectId,
            ref: "SubSection",
        },
    ],
}, { timestamps: true });
const CourseProgress = model("CourseProgress", courseProgressSchema);
export default CourseProgress;
//# sourceMappingURL=CourseProgress.js.map