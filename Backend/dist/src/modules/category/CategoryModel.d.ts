import { Schema } from "mongoose";
export declare const Category: import("mongoose").Model<{
    name: string;
    isActive: boolean;
    courses: import("mongoose").Types.ObjectId[];
    description?: string | null;
}, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    name: string;
    isActive: boolean;
    courses: import("mongoose").Types.ObjectId[];
    description?: string | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    name: string;
    isActive: boolean;
    courses: import("mongoose").Types.ObjectId[];
    description?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    name: string;
    isActive: boolean;
    courses: import("mongoose").Types.ObjectId[];
    description?: string | null;
}, import("mongoose").Document<unknown, {}, {
    name: string;
    isActive: boolean;
    courses: import("mongoose").Types.ObjectId[];
    description?: string | null;
}, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
    name: string;
    isActive: boolean;
    courses: import("mongoose").Types.ObjectId[];
    description?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        name: string;
        isActive: boolean;
        courses: import("mongoose").Types.ObjectId[];
        description?: string | null;
    }, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
        name: string;
        isActive: boolean;
        courses: import("mongoose").Types.ObjectId[];
        description?: string | null;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    name: string;
    isActive: boolean;
    courses: import("mongoose").Types.ObjectId[];
    description?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    isActive: boolean;
    courses: import("mongoose").Types.ObjectId[];
    description?: string | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=CategoryModel.d.ts.map