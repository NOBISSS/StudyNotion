import type { Types } from "mongoose";
import Comment from "../comment/CommentModel.js";
import { Course } from "../course/CourseModel.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";

export async function handleInstructorDeletion(instructorId: Types.ObjectId) {
  // 2. Orphan courses — keep them alive for existing students
  await Course.updateMany(
    { instructorId, status: "Published" },
    {
      $set: {
        instructorName: "Former Instructor",
        isOrphaned: true,
      },
    },
  );

  // 3. Unpublish draft courses — no students enrolled yet, safe to hide
  await Course.updateMany(
    { instructorId, status: "Draft" },
    { $set: { isActive: false, status: "Removed" } },
  );

  // 4. Soft delete their comments/discussions
  await Comment.updateMany(
    { userId: instructorId },
    { $set: { isDeleted: true, message: "[deleted]" } },
  );

  // 5. Keep reviews but anonymize
  await RatingAndReview.updateMany(
    { userId: instructorId },
    { $set: { displayName: "Former Instructor" } },
  );

  //   // 6. Hard delete sessions
  //   await Session.deleteMany({ userId: instructorId });

  //   // 7. Cancel pending payouts — handle financially
  //   await Payout.updateMany(
  //     { instructorId, status: "pending" },
  //     { $set: { status: "cancelled" } },
  //   );
}
export async function handleUserDeletion(userId: Types.ObjectId) {
  await CourseEnrollment.updateMany(
    { userId: userId as Types.ObjectId, isActive: false },
    { $set: { isDeleted: true } },
  );
  await Comment.updateMany(
    { userId: userId as Types.ObjectId },
    { $set: { isDeleted: true } },
  );
  await RatingAndReview.updateMany(
    { userId: userId as Types.ObjectId },
    { $set: { isDeleted: true } },
  );
}
