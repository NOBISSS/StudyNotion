import { Schema, Types } from "mongoose";
export declare const Section: import("mongoose").Model<{
    name: string;
    courseId: Types.ObjectId;
    order: number;
    subSectionIds: Types.ObjectId[];
    isRemoved: boolean;
    lastOrder?: number | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    name: string;
    courseId: Types.ObjectId;
    order: number;
    subSectionIds: Types.ObjectId[];
    isRemoved: boolean;
    lastOrder?: number | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    courseId: Types.ObjectId;
    order: number;
    subSectionIds: Types.ObjectId[];
    isRemoved: boolean;
    lastOrder?: number | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    courseId: Types.ObjectId;
    order: number;
    subSectionIds: Types.ObjectId[];
    isRemoved: boolean;
    lastOrder?: number | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    name: string;
    courseId: Types.ObjectId;
    order: number;
    subSectionIds: Types.ObjectId[];
    isRemoved: boolean;
    lastOrder?: number | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    courseId: Types.ObjectId;
    order: number;
    subSectionIds: Types.ObjectId[];
    isRemoved: boolean;
    lastOrder?: number | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    courseId: Types.ObjectId;
    order: number;
    subSectionIds: Types.ObjectId[];
    isRemoved: boolean;
    lastOrder?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    courseId: Types.ObjectId;
    order: number;
    subSectionIds: Types.ObjectId[];
    isRemoved: boolean;
    lastOrder?: number | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=SectionModel.d.ts.map