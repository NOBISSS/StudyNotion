// title string
    // message string
    // courseId objectId fk
    // createdAt Date
    // updatedAt Date

import { Schema, Types, model } from "mongoose";

const announcementSchema = new Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
}, { timestamps: true });

const Announcement = model("Announcement", announcementSchema);

export default Announcement;