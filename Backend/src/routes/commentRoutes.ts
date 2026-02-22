import { Router } from "express";
import { createComment, deleteComment, getCommentsBySubSectionId, updateComment } from "../controllers/commentController.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";

const CommentRouter = Router();

CommentRouter.use(userMiddleware);
CommentRouter.route("/add").post(createComment);
CommentRouter.route("/get/:subsectionId").get(getCommentsBySubSectionId);
CommentRouter.route("/update/:commentId").put(updateComment);
CommentRouter.route("/delete/:commentId").delete(deleteComment);

export default CommentRouter;