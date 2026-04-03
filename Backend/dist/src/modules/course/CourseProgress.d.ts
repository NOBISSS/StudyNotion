import { Schema, Types } from "mongoose";
declare const CourseProgress: import("mongoose").Model<{
    progress: number;
    completed: boolean;
    completedSubsections: Types.ObjectId[];
    userId?: Types.ObjectId | null;
    courseId?: Types.ObjectId | null;
    completionDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    progress: number;
    completed: boolean;
    completedSubsections: Types.ObjectId[];
    userId?: Types.ObjectId | null;
    courseId?: Types.ObjectId | null;
    completionDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    progress: number;
    completed: boolean;
    completedSubsections: Types.ObjectId[];
    userId?: Types.ObjectId | null;
    courseId?: Types.ObjectId | null;
    completionDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    progress: number;
    completed: boolean;
    completedSubsections: Types.ObjectId[];
    userId?: Types.ObjectId | null;
    courseId?: Types.ObjectId | null;
    completionDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    progress: number;
    completed: boolean;
    completedSubsections: Types.ObjectId[];
    userId?: Types.ObjectId | null;
    courseId?: Types.ObjectId | null;
    completionDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    progress: number;
    completed: boolean;
    completedSubsections: Types.ObjectId[];
    userId?: Types.ObjectId | null;
    courseId?: Types.ObjectId | null;
    completionDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    progress: number;
    completed: boolean;
    completedSubsections: Types.ObjectId[];
    userId?: Types.ObjectId | null;
    courseId?: Types.ObjectId | null;
    completionDate?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    progress: number;
    completed: boolean;
    completedSubsections: Types.ObjectId[];
    userId?: Types.ObjectId | null;
    courseId?: Types.ObjectId | null;
    completionDate?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export default CourseProgress;
//# sourceMappingURL=CourseProgress.d.ts.map