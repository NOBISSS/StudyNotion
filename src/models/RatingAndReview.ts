import { model, Schema, Types } from "mongoose";

const RatingAndReviewSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      trim: true,
      required: true,
    },
    courseId: {
      type: Types.ObjectId,
      required: true,
      ref: "Course",
      index: true,
    },
  },
  { timestamps: true }
);

export const RatingAndReview = model("RatingAndReview", RatingAndReviewSchema);
