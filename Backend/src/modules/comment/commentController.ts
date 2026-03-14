import { Types } from "mongoose";
import { StatusCode, type Handler } from "../../shared/types.js";
import Comment from "./CommentModel.js";
import { createCommentSchema } from "./commentValidation.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { AppError } from "../../shared/lib/AppError.js";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";

export const createComment = asyncHandler(async (req, res) => {
    const parsedCommentData = createCommentSchema.safeParse(req.body);
    const userId = req.userId;
    if (!userId) {
      throw AppError.unauthorized("Unauthorized. User ID is missing.");
    }
    if (!parsedCommentData.success) {
      throw AppError.badRequest(parsedCommentData.error.issues[0]?.message || "Invalid input");
    }
    const { subSectionId, message } = parsedCommentData.data;
    const comment = await Comment.create({
      subSectionId,
      userId,
      message,
    });
    ApiResponse.created(res, {
      message: "Comment created successfully",
      comment,
    });
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
    ApiResponse.success(res, {
      message: "Comments fetched successfully",
      comments: commentsWithOwnership,
    });
});
export const updateComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.userId;
    if (!userId || !commentId) {
      throw AppError.unauthorized("Unauthorized. User ID or Comment ID is missing.");
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
    ApiResponse.success(res, {
      message: "Comment updated successfully",
      comment,
    });
});
export const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.userId;
    if (!userId || !commentId) {
      throw AppError.unauthorized("Unauthorized. User ID or Comment ID is missing.");
    }
    const comment = await Comment.findOneAndUpdate(
      { _id: new Types.ObjectId(commentId), userId },
      { isDeleted: true },
      { new: true },
    );
    if (!comment) {
      throw AppError.notFound("Comment not found");
    }
    ApiResponse.success(res, {
      message: "Comment deleted successfully",
    });
});
