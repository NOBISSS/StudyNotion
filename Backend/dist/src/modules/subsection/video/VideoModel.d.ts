import { Schema } from "mongoose";
declare const Video: import("mongoose").Model<{
    isNew: boolean;
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    originalVideoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    tempVideoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    tempVideoS3Key?: string | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    isNew: boolean;
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    originalVideoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    tempVideoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    tempVideoS3Key?: string | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    isNew: boolean;
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    originalVideoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    tempVideoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    tempVideoS3Key?: string | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    isNew: boolean;
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    originalVideoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    tempVideoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    tempVideoS3Key?: string | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    isNew: boolean;
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    originalVideoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    tempVideoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    tempVideoS3Key?: string | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    isNew: boolean;
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    originalVideoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    tempVideoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    tempVideoS3Key?: string | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    isNew: boolean;
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    originalVideoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    tempVideoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    tempVideoS3Key?: string | null;
    videoURL?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    isNew: boolean;
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    originalVideoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    tempVideoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    tempVideoS3Key?: string | null;
    videoURL?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export default Video;
//# sourceMappingURL=VideoModel.d.ts.map