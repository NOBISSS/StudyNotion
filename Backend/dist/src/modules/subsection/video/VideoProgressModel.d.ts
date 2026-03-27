import { Schema } from "mongoose";
declare const VideoProgress: import("mongoose").Model<{
    isCompleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    duration: number;
    videoId: import("mongoose").Types.ObjectId;
    currentTime: number;
    watchedPercentage: number;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    isCompleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    duration: number;
    videoId: import("mongoose").Types.ObjectId;
    currentTime: number;
    watchedPercentage: number;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    isCompleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    duration: number;
    videoId: import("mongoose").Types.ObjectId;
    currentTime: number;
    watchedPercentage: number;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    isCompleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    duration: number;
    videoId: import("mongoose").Types.ObjectId;
    currentTime: number;
    watchedPercentage: number;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    isCompleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    duration: number;
    videoId: import("mongoose").Types.ObjectId;
    currentTime: number;
    watchedPercentage: number;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    isCompleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    duration: number;
    videoId: import("mongoose").Types.ObjectId;
    currentTime: number;
    watchedPercentage: number;
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
        isCompleted: boolean;
        userId: import("mongoose").Types.ObjectId;
        subSectionId: import("mongoose").Types.ObjectId;
        courseId: import("mongoose").Types.ObjectId;
        duration: number;
        videoId: import("mongoose").Types.ObjectId;
        currentTime: number;
        watchedPercentage: number;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        isCompleted: boolean;
        userId: import("mongoose").Types.ObjectId;
        subSectionId: import("mongoose").Types.ObjectId;
        courseId: import("mongoose").Types.ObjectId;
        duration: number;
        videoId: import("mongoose").Types.ObjectId;
        currentTime: number;
        watchedPercentage: number;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    isCompleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    duration: number;
    videoId: import("mongoose").Types.ObjectId;
    currentTime: number;
    watchedPercentage: number;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    isCompleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    subSectionId: import("mongoose").Types.ObjectId;
    courseId: import("mongoose").Types.ObjectId;
    duration: number;
    videoId: import("mongoose").Types.ObjectId;
    currentTime: number;
    watchedPercentage: number;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export default VideoProgress;
//# sourceMappingURL=VideoProgressModel.d.ts.map