import { model, Schema } from "mongoose";

const QuizAttemptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    adaptiveData: { type: Array, default: [] },
    attemptedAt: { type: Date, default: Date.now },
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Quiz.questions.questionId",
          required: true,
        },
        answer: { type: Schema.Types.ObjectId, ref: "Quiz.questions.options.optionId", required: true },
        isCorrect: { type: Boolean, required: true },
        answeredAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

const QuizAttempt = model("QuizAttempt", QuizAttemptSchema);

export default QuizAttempt;
