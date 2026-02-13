import { Router } from "express";
import { createComment, getCommentsBySubSectionId } from "../controllers/commentController.js";

const CommentRouter = Router();

CommentRouter.route("/add").post(createComment);
CommentRouter.route("/get/:subsectionId").get(getCommentsBySubSectionId);

export default CommentRouter;