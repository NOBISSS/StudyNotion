import { Schema, Types, model } from "mongoose";

const announcementSchema = new Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    readedBy: [{ type: Types.ObjectId, ref: "User" }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Announcement = model("Announcement", announcementSchema);

export default Announcement;