import { Router } from "express";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import {
  createComment,
  deleteComment,
  getCommentsBySubSectionId,
  updateComment,
} from "../modules/comment/commentController.js";

const CommentRouter = Router();

CommentRouter.use(userMiddleware);
CommentRouter.route("/add").post(createComment);
CommentRouter.route("/get/:subsectionId").get(getCommentsBySubSectionId);
CommentRouter.route("/update/:commentId").put(updateComment);
CommentRouter.route("/delete/:commentId").delete(deleteComment);

export default CommentRouter;
