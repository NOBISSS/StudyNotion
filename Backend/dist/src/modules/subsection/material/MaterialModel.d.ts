import { Schema, Types } from "mongoose";
export declare const Material: import("mongoose").Model<{
    isActive: boolean;
    subsectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    contentUrl: string;
    materialType: string;
    materialS3Key: string;
    materialName?: string | null;
    materialSize?: number | null;
    URLExpiration?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    subsectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    contentUrl: string;
    materialType: string;
    materialS3Key: string;
    materialName?: string | null;
    materialSize?: number | null;
    URLExpiration?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    isActive: boolean;
    subsectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    contentUrl: string;
    materialType: string;
    materialS3Key: string;
    materialName?: string | null;
    materialSize?: number | null;
    URLExpiration?: NativeDate | null;
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
    subsectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    contentUrl: string;
    materialType: string;
    materialS3Key: string;
    materialName?: string | null;
    materialSize?: number | null;
    URLExpiration?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    subsectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    contentUrl: string;
    materialType: string;
    materialS3Key: string;
    materialName?: string | null;
    materialSize?: number | null;
    URLExpiration?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    isActive: boolean;
    subsectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    contentUrl: string;
    materialType: string;
    materialS3Key: string;
    materialName?: string | null;
    materialSize?: number | null;
    URLExpiration?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        isActive: boolean;
        subsectionId: Types.ObjectId;
        courseId: Types.ObjectId;
        contentUrl: string;
        materialType: string;
        materialS3Key: string;
        materialName?: string | null;
        materialSize?: number | null;
        URLExpiration?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        isActive: boolean;
        subsectionId: Types.ObjectId;
        courseId: Types.ObjectId;
        contentUrl: string;
        materialType: string;
        materialS3Key: string;
        materialName?: string | null;
        materialSize?: number | null;
        URLExpiration?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    isActive: boolean;
    subsectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    contentUrl: string;
    materialType: string;
    materialS3Key: string;
    materialName?: string | null;
    materialSize?: number | null;
    URLExpiration?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    isActive: boolean;
    subsectionId: Types.ObjectId;
    courseId: Types.ObjectId;
    contentUrl: string;
    materialType: string;
    materialS3Key: string;
    materialName?: string | null;
    materialSize?: number | null;
    URLExpiration?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=MaterialModel.d.ts.map