import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import Comment from "./CommentModel.js";
import { createCommentSchema } from "./commentValidation.js";

export const createComment = asyncHandler(async (req, res) => {
  const parsedCommentData = createCommentSchema.safeParse(req.body);
  const userId = req.userId;
  if (!userId) {
    throw AppError.unauthorized("Unauthorized. User ID is missing.");
  }
  if (!parsedCommentData.success) {
    throw AppError.badRequest(
      parsedCommentData.error.issues[0]?.message || "Invalid input",
    );
  }
  const { subSectionId, message } = parsedCommentData.data;
  const comment = await Comment.create({
    subSectionId,
    userId,
    message,
  });
  ApiResponse.created(
    res,
    {
      comment,
    },
    "Comment created successfully",
  );
});
export const getCommentsBySubSectionId = asyncHandler(async (req, res) => {
  const subsectionId = req.params.subsectionId;
  const userId = req.userId;
  const comments = await Comment.find({ subsectionId }).populate(
    "userId",
    "name email",
  );
  const commentsWithOwnership = comments.map((comment) => ({
    ...comment.toObject(),
    isOwner: comment.userId._id === userId,
  }));
  ApiResponse.success(
    res,
    {
      comments: commentsWithOwnership,
    },
    "Comments fetched successfully",
  );
});
export const updateComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.userId;
  if (!userId || !commentId) {
    throw AppError.unauthorized(
      "Unauthorized. User ID or Comment ID is missing.",
    );
  }
  const { message } = req.body;
  const comment = await Comment.findOneAndUpdate(
    { _id: new Types.ObjectId(commentId), userId },
    { message, isEdited: true },
    { new: true },
  );
  if (!comment) {
    throw AppError.notFound("Comment not found");
  }
  ApiResponse.success(
    res,
    {
      comment,
    },
    "Comment updated successfully",
  );
});
export const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.userId;
  if (!userId || !commentId) {
    throw AppError.unauthorized(
      "Unauthorized. User ID or Comment ID is missing.",
    );
  }
  const comment = await Comment.findOneAndUpdate(
    { _id: new Types.ObjectId(commentId), userId },
    { isDeleted: true },
    { new: true },
  );
  if (!comment) {
    throw AppError.notFound("Comment not found");
  }
  ApiResponse.success(res, {}, "Comment deleted successfully");
});
