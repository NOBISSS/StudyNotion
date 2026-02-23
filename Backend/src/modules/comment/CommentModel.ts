import { model, Schema } from "mongoose";

const CommentSchema = new Schema({
    subSectionId: { type: Schema.Types.ObjectId, ref: "SubSection", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
}, { timestamps: true });

const Comment = model("Comment", CommentSchema);

export default Comment;