import { model, Schema, Types } from "mongoose";

const quizSchema = new Schema(
  {
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    subSectionId: { type: Types.ObjectId, ref: "SubSection", required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
        points: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

export const Quiz = model("Quiz", quizSchema);
