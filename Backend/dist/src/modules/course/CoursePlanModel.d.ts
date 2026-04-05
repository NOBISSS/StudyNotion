import { Schema, Types } from "mongoose";
export declare const CoursePlan: import("mongoose").Model<{
    status: "Available" | "Not Available";
    instructorId: Types.ObjectId;
    categoryId: Types.ObjectId;
    courseId: Types.ObjectId;
    plan: string[];
    startDate: NativeDate;
    endDate: NativeDate;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    status: "Available" | "Not Available";
    instructorId: Types.ObjectId;
    categoryId: Types.ObjectId;
    courseId: Types.ObjectId;
    plan: string[];
    startDate: NativeDate;
    endDate: NativeDate;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    status: "Available" | "Not Available";
    instructorId: Types.ObjectId;
    categoryId: Types.ObjectId;
    courseId: Types.ObjectId;
    plan: string[];
    startDate: NativeDate;
    endDate: NativeDate;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "Available" | "Not Available";
    instructorId: Types.ObjectId;
    categoryId: Types.ObjectId;
    courseId: Types.ObjectId;
    plan: string[];
    startDate: NativeDate;
    endDate: NativeDate;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    status: "Available" | "Not Available";
    instructorId: Types.ObjectId;
    categoryId: Types.ObjectId;
    courseId: Types.ObjectId;
    plan: string[];
    startDate: NativeDate;
    endDate: NativeDate;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    status: "Available" | "Not Available";
    instructorId: Types.ObjectId;
    categoryId: Types.ObjectId;
    courseId: Types.ObjectId;
    plan: string[];
    startDate: NativeDate;
    endDate: NativeDate;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    status: "Available" | "Not Available";
    instructorId: Types.ObjectId;
    categoryId: Types.ObjectId;
    courseId: Types.ObjectId;
    plan: string[];
    startDate: NativeDate;
    endDate: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    status: "Available" | "Not Available";
    instructorId: Types.ObjectId;
    categoryId: Types.ObjectId;
    courseId: Types.ObjectId;
    plan: string[];
    startDate: NativeDate;
    endDate: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=CoursePlanModel.d.ts.map