import { Schema } from "mongoose";
declare const Profile: import("mongoose").Model<{
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    about?: string | null;
    contactNumber?: string | null;
    gender?: "male" | "female" | "other" | null;
    city?: string | null;
    country?: string | null;
    profilePicture?: string | null;
    birthdate?: NativeDate | null;
}, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    about?: string | null;
    contactNumber?: string | null;
    gender?: "male" | "female" | "other" | null;
    city?: string | null;
    country?: string | null;
    profilePicture?: string | null;
    birthdate?: NativeDate | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    about?: string | null;
    contactNumber?: string | null;
    gender?: "male" | "female" | "other" | null;
    city?: string | null;
    country?: string | null;
    profilePicture?: string | null;
    birthdate?: NativeDate | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    about?: string | null;
    contactNumber?: string | null;
    gender?: "male" | "female" | "other" | null;
    city?: string | null;
    country?: string | null;
    profilePicture?: string | null;
    birthdate?: NativeDate | null;
}, import("mongoose").Document<unknown, {}, {
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    about?: string | null;
    contactNumber?: string | null;
    gender?: "male" | "female" | "other" | null;
    city?: string | null;
    country?: string | null;
    profilePicture?: string | null;
    birthdate?: NativeDate | null;
}, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    about?: string | null;
    contactNumber?: string | null;
    gender?: "male" | "female" | "other" | null;
    city?: string | null;
    country?: string | null;
    profilePicture?: string | null;
    birthdate?: NativeDate | null;
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
        isDeleted: boolean;
        userId: import("mongoose").Types.ObjectId;
        about?: string | null;
        contactNumber?: string | null;
        gender?: "male" | "female" | "other" | null;
        city?: string | null;
        country?: string | null;
        profilePicture?: string | null;
        birthdate?: NativeDate | null;
    }, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
        isDeleted: boolean;
        userId: import("mongoose").Types.ObjectId;
        about?: string | null;
        contactNumber?: string | null;
        gender?: "male" | "female" | "other" | null;
        city?: string | null;
        country?: string | null;
        profilePicture?: string | null;
        birthdate?: NativeDate | null;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    about?: string | null;
    contactNumber?: string | null;
    gender?: "male" | "female" | "other" | null;
    city?: string | null;
    country?: string | null;
    profilePicture?: string | null;
    birthdate?: NativeDate | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    isDeleted: boolean;
    userId: import("mongoose").Types.ObjectId;
    about?: string | null;
    contactNumber?: string | null;
    gender?: "male" | "female" | "other" | null;
    city?: string | null;
    country?: string | null;
    profilePicture?: string | null;
    birthdate?: NativeDate | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export { Profile };
//# sourceMappingURL=ProfileModel.d.ts.map