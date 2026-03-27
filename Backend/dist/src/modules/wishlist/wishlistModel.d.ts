import { Schema, Types } from "mongoose";
declare const Wishlist: import("mongoose").Model<{
    priority: number;
    userId: Types.ObjectId;
    courseIds: Types.ObjectId[];
    bundleIds: Types.ObjectId[];
    status: "active" | "purchased";
    notes?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    priority: number;
    userId: Types.ObjectId;
    courseIds: Types.ObjectId[];
    bundleIds: Types.ObjectId[];
    status: "active" | "purchased";
    notes?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    priority: number;
    userId: Types.ObjectId;
    courseIds: Types.ObjectId[];
    bundleIds: Types.ObjectId[];
    status: "active" | "purchased";
    notes?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    priority: number;
    userId: Types.ObjectId;
    courseIds: Types.ObjectId[];
    bundleIds: Types.ObjectId[];
    status: "active" | "purchased";
    notes?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    priority: number;
    userId: Types.ObjectId;
    courseIds: Types.ObjectId[];
    bundleIds: Types.ObjectId[];
    status: "active" | "purchased";
    notes?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    priority: number;
    userId: Types.ObjectId;
    courseIds: Types.ObjectId[];
    bundleIds: Types.ObjectId[];
    status: "active" | "purchased";
    notes?: string | null;
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
        priority: number;
        userId: Types.ObjectId;
        courseIds: Types.ObjectId[];
        bundleIds: Types.ObjectId[];
        status: "active" | "purchased";
        notes?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        priority: number;
        userId: Types.ObjectId;
        courseIds: Types.ObjectId[];
        bundleIds: Types.ObjectId[];
        status: "active" | "purchased";
        notes?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    priority: number;
    userId: Types.ObjectId;
    courseIds: Types.ObjectId[];
    bundleIds: Types.ObjectId[];
    status: "active" | "purchased";
    notes?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    priority: number;
    userId: Types.ObjectId;
    courseIds: Types.ObjectId[];
    bundleIds: Types.ObjectId[];
    status: "active" | "purchased";
    notes?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export default Wishlist;
//# sourceMappingURL=wishlistModel.d.ts.map