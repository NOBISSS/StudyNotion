import { Schema } from "mongoose";
declare const Comment: import("mongoose").Model<{
    message: string;
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    isEdited: boolean;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    message: string;
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    isEdited: boolean;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    message: string;
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    isEdited: boolean;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    message: string;
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    isEdited: boolean;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    message: string;
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    isEdited: boolean;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    message: string;
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    isEdited: boolean;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    message: string;
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    isEdited: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    message: string;
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    isEdited: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export default Comment;
//# sourceMappingURL=CommentModel.d.ts.map