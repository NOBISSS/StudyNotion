import { model, Schema } from "mongoose";

const CommentSchema = new Schema({
    subSectionId: { type: Schema.Types.ObjectId, ref: "SubSection", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
}, { timestamps: true });

const Comment = model("Comment", CommentSchema);

export default Comment;