import { Schema } from "mongoose";
declare const Video: import("mongoose").Model<{
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
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
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    videoURL?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        isActive: boolean;
        subsectionId: import("mongoose").Types.ObjectId;
        courseId: import("mongoose").Types.ObjectId;
        sectionId: import("mongoose").Types.ObjectId;
        videoS3Key: string;
        type?: string | null;
        status?: string | null;
        URLExpiration?: NativeDate | null;
        videoName?: string | null;
        duration?: number | null;
        videoSize?: number | null;
        videoURL?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        isActive: boolean;
        subsectionId: import("mongoose").Types.ObjectId;
        courseId: import("mongoose").Types.ObjectId;
        sectionId: import("mongoose").Types.ObjectId;
        videoS3Key: string;
        type?: string | null;
        status?: string | null;
        URLExpiration?: NativeDate | null;
        videoName?: string | null;
        duration?: number | null;
        videoSize?: number | null;
        videoURL?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
    videoURL?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    isActive: boolean;
    subsectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    sectionId: import("mongoose").Types.ObjectId;
    videoS3Key: string;
    type?: string | null;
    status?: string | null;
    URLExpiration?: NativeDate | null;
    videoName?: string | null;
    duration?: number | null;
    videoSize?: number | null;
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