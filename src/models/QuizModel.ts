import { model, Schema, Types } from "mongoose";

const quizSchema = new Schema(
  {
    courseId: { type: Types.ObjectId, ref: "Course", required: true },
    subSectionId: { type: Types.ObjectId, ref: "SubSection", required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [
      {
        questionId: { type: Types.ObjectId, default: new Types.ObjectId() },
        question: { type: String, required: true },
        options: [{ optionId: { type: Types.ObjectId, default: new Types.ObjectId() }, optionText: { type: String, required: true } }],
        correctAnswer: { type: Types.ObjectId, required: true },
        points: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

export const Quiz = model("Quiz", quizSchema);
