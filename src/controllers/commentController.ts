import Comment from "../models/CommentModel.js";
import { StatusCode, type Handler } from "../types.js";
import { createCommentSchema } from "../validations/commentValidation.js";

export const createComment:Handler = async (req, res) => {
    try{
        const parsedCommentData = createCommentSchema.safeParse(req.body);
        const userId = req.userId;
        if (!userId) {
            res.status(StatusCode.Unauthorized).json({
                message: "Unauthorized. User ID is missing.",
            });
            return;
        }
        if (!parsedCommentData.success) {
            return res.status(StatusCode.InputError).json({
                message: parsedCommentData.error.issues[0]?.message,
            });
        }
        const { subSectionId, message } = parsedCommentData.data;
        const comment = await Comment.create({
            subSectionId,
            userId,
            message,
        });
        res.status(StatusCode.Success).json({
            message: "Comment created successfully",
            comment,
        });
        return;
    }catch(err){
        res.status(StatusCode.ServerError).json({
            message: "Something went wrong from ourside",
            error: err instanceof Error ? err.message : "Unknown error",
        });
        return;
    }
}