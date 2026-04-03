import { Schema, Types } from "mongoose";
declare const Announcement: import("mongoose").Model<{
    message: string;
    isDeleted: boolean;
    courseId: Types.ObjectId;
    title: string;
    readedBy: Types.ObjectId[];
    createdBy: Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    message: string;
    isDeleted: boolean;
    courseId: Types.ObjectId;
    title: string;
    readedBy: Types.ObjectId[];
    createdBy: Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    message: string;
    isDeleted: boolean;
    courseId: Types.ObjectId;
    title: string;
    readedBy: Types.ObjectId[];
    createdBy: Types.ObjectId;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    message: string;
    isDeleted: boolean;
    courseId: Types.ObjectId;
    title: string;
    readedBy: Types.ObjectId[];
    createdBy: Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    message: string;
    isDeleted: boolean;
    courseId: Types.ObjectId;
    title: string;
    readedBy: Types.ObjectId[];
    createdBy: Types.ObjectId;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    message: string;
    isDeleted: boolean;
    courseId: Types.ObjectId;
    title: string;
    readedBy: Types.ObjectId[];
    createdBy: Types.ObjectId;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    message: string;
    isDeleted: boolean;
    courseId: Types.ObjectId;
    title: string;
    readedBy: Types.ObjectId[];
    createdBy: Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    message: string;
    isDeleted: boolean;
    courseId: Types.ObjectId;
    title: string;
    readedBy: Types.ObjectId[];
    createdBy: Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export default Announcement;
//# sourceMappingURL=announcementModel.d.ts.map