import Comment from "../comment/CommentModel.js";
import { Course } from "../course/CourseModel.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";
export async function handleInstructorDeletion(instructorId) {
    await Course.updateMany({ instructorId, status: "Published" }, {
        $set: {
            instructorName: "Former Instructor",
            isOrphaned: true,
        },
    });
    await Course.updateMany({ instructorId, status: "Draft" }, { $set: { isActive: false, status: "Removed" } });
    await Comment.updateMany({ userId: instructorId }, { $set: { isDeleted: true, message: "[deleted]" } });
    await RatingAndReview.updateMany({ userId: instructorId }, { $set: { displayName: "Former Instructor" } });
}
export async function handleUserDeletion(userId) {
    await CourseEnrollment.updateMany({ userId: userId, isActive: false }, { $set: { isDeleted: true } });
    await Comment.updateMany({ userId: userId }, { $set: { isDeleted: true } });
    await RatingAndReview.updateMany({ userId: userId }, { $set: { isDeleted: true } });
}
//# sourceMappingURL=profile.utils.js.map