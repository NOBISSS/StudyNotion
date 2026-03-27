import { model, Schema, Types } from "mongoose";
const CourseEnrollmentSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: "User",
    },
    courseId: {
        type: Types.ObjectId,
        required: true,
        ref: "Course",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
export const CourseEnrollment = model("CourseEnrollment", CourseEnrollmentSchema);
//# sourceMappingURL=CourseEnrollment.js.map