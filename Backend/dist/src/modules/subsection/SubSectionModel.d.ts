import { Schema, Types } from "mongoose";
export declare const SubSection: import("mongoose").Model<{
    isActive: boolean;
    courseId: Types.ObjectId;
    title: string;
    contentType: "video" | "material" | "quiz";
    isPreview: boolean;
    sectionId: Types.ObjectId;
    isAvailable: boolean;
    description?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    courseId: Types.ObjectId;
    title: string;
    contentType: "video" | "material" | "quiz";
    isPreview: boolean;
    sectionId: Types.ObjectId;
    isAvailable: boolean;
    description?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    isActive: boolean;
    courseId: Types.ObjectId;
    title: string;
    contentType: "video" | "material" | "quiz";
    isPreview: boolean;
    sectionId: Types.ObjectId;
    isAvailable: boolean;
    description?: string | null;
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
    courseId: Types.ObjectId;
    title: string;
    contentType: "video" | "material" | "quiz";
    isPreview: boolean;
    sectionId: Types.ObjectId;
    isAvailable: boolean;
    description?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    courseId: Types.ObjectId;
    title: string;
    contentType: "video" | "material" | "quiz";
    isPreview: boolean;
    sectionId: Types.ObjectId;
    isAvailable: boolean;
    description?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    isActive: boolean;
    courseId: Types.ObjectId;
    title: string;
    contentType: "video" | "material" | "quiz";
    isPreview: boolean;
    sectionId: Types.ObjectId;
    isAvailable: boolean;
    description?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    isActive: boolean;
    courseId: Types.ObjectId;
    title: string;
    contentType: "video" | "material" | "quiz";
    isPreview: boolean;
    sectionId: Types.ObjectId;
    isAvailable: boolean;
    description?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    isActive: boolean;
    courseId: Types.ObjectId;
    title: string;
    contentType: "video" | "material" | "quiz";
    isPreview: boolean;
    sectionId: Types.ObjectId;
    isAvailable: boolean;
    description?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=SubSectionModel.d.ts.map