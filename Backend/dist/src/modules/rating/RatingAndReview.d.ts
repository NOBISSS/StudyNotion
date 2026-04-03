import { Schema, Types } from "mongoose";
export declare const RatingAndReview: import("mongoose").Model<{
    isActive: boolean;
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    rating: number;
    review: string;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    rating: number;
    review: string;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    isActive: boolean;
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    rating: number;
    review: string;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    isActive: boolean;
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    rating: number;
    review: string;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    rating: number;
    review: string;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    isActive: boolean;
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    rating: number;
    review: string;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    isActive: boolean;
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    rating: number;
    review: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    isActive: boolean;
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    rating: number;
    review: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=RatingAndReview.d.ts.map