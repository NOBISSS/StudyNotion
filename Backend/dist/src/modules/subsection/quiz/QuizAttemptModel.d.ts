import { Schema } from "mongoose";
declare const QuizAttempt: import("mongoose").Model<{
    userId: import("mongoose").Types.ObjectId;
    score: number;
    quizId: import("mongoose").Types.ObjectId;
    adaptiveData: any[];
    attemptedAt: NativeDate;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, {}, {}> & {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    userId: import("mongoose").Types.ObjectId;
    score: number;
    quizId: import("mongoose").Types.ObjectId;
    adaptiveData: any[];
    attemptedAt: NativeDate;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, {}, {}> & {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: import("mongoose").Types.ObjectId;
    score: number;
    quizId: import("mongoose").Types.ObjectId;
    adaptiveData: any[];
    attemptedAt: NativeDate;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, {}, {}> & {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: import("mongoose").Types.ObjectId;
    score: number;
    quizId: import("mongoose").Types.ObjectId;
    adaptiveData: any[];
    attemptedAt: NativeDate;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, {}, {}> & {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    userId: import("mongoose").Types.ObjectId;
    score: number;
    quizId: import("mongoose").Types.ObjectId;
    adaptiveData: any[];
    attemptedAt: NativeDate;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, {}, {}> & {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    userId: import("mongoose").Types.ObjectId;
    score: number;
    quizId: import("mongoose").Types.ObjectId;
    adaptiveData: any[];
    attemptedAt: NativeDate;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, {}, {}> & {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    userId: import("mongoose").Types.ObjectId;
    score: number;
    quizId: import("mongoose").Types.ObjectId;
    adaptiveData: any[];
    attemptedAt: NativeDate;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, {}, {}> & {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    userId: import("mongoose").Types.ObjectId;
    score: number;
    quizId: import("mongoose").Types.ObjectId;
    adaptiveData: any[];
    attemptedAt: NativeDate;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, unknown, {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }, {}, {}> & {
        questionId: import("mongoose").Types.ObjectId;
        answer: import("mongoose").Types.ObjectId;
        isCorrect: boolean;
        answeredAt: NativeDate;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export default QuizAttempt;
//# sourceMappingURL=QuizAttemptModel.d.ts.map