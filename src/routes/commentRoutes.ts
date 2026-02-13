import { Router } from "express";
import { createComment } from "../controllers/commentController.js";

const CommentRouter = Router();

CommentRouter.route("/add").post(createComment);

export default CommentRouter;