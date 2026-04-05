import mongoose, { type HydratedDocument, type InferSchemaType } from "mongoose";
export declare const UserSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {
    comparePassword: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, inputPassword: string) => boolean;
    hashPassword: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, inputPassword: string) => Promise<void>;
    generateAccessAndRefreshToken: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) => {
        accessToken: string;
        refreshToken: string;
    };
}, {}, {}, {}, {
    methods: {
        comparePassword(this: mongoose.Document<unknown, {}, {
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        }, {
            id: string;
        }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, inputPassword: string): boolean;
        hashPassword(this: mongoose.Document<unknown, {}, {
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        }, {
            id: string;
        }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, inputPassword: string): Promise<void>;
        generateAccessAndRefreshToken(this: mongoose.Document<unknown, {}, {
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        }, {
            id: string;
        }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }): {
            accessToken: string;
            refreshToken: string;
        };
    };
}, {
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
}, mongoose.Document<unknown, {}, {
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export type IUser = InferSchemaType<typeof UserSchema>;
export type UserDocument = HydratedDocument<IUser>;
declare const User: mongoose.Model<{
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
}, {}, {
    comparePassword: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, inputPassword: string) => boolean;
    hashPassword: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, inputPassword: string) => Promise<void>;
    generateAccessAndRefreshToken: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) => {
        accessToken: string;
        refreshToken: string;
    };
}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
}, {
    id: string;
}, {
    methods: {
        comparePassword(this: mongoose.Document<unknown, {}, {
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        }, {
            id: string;
        }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, inputPassword: string): boolean;
        hashPassword(this: mongoose.Document<unknown, {}, {
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        }, {
            id: string;
        }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, inputPassword: string): Promise<void>;
        generateAccessAndRefreshToken(this: mongoose.Document<unknown, {}, {
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        }, {
            id: string;
        }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }): {
            accessToken: string;
            refreshToken: string;
        };
    };
}> & Omit<{
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id" | "comparePassword" | "hashPassword" | "generateAccessAndRefreshToken"> & {
    id: string;
} & {
    comparePassword: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, inputPassword: string) => boolean;
    hashPassword: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, inputPassword: string) => Promise<void>;
    generateAccessAndRefreshToken: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) => {
        accessToken: string;
        refreshToken: string;
    };
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {
    comparePassword: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, inputPassword: string) => boolean;
    hashPassword: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, inputPassword: string) => Promise<void>;
    generateAccessAndRefreshToken: (this: mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) => {
        accessToken: string;
        refreshToken: string;
    };
}, {}, {}, {}, {
    methods: {
        comparePassword(this: mongoose.Document<unknown, {}, {
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        }, {
            id: string;
        }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, inputPassword: string): boolean;
        hashPassword(this: mongoose.Document<unknown, {}, {
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        }, {
            id: string;
        }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, inputPassword: string): Promise<void>;
        generateAccessAndRefreshToken(this: mongoose.Document<unknown, {}, {
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        }, {
            id: string;
        }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            method: "local" | "google" | "github";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
            deletedAt?: NativeDate | null;
        } & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }): {
            accessToken: string;
            refreshToken: string;
        };
    };
}, {
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
}, mongoose.Document<unknown, {}, {
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
}, {
    id: string;
}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: mongoose.SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: mongoose.SchemaDefinitionProperty<any, any, mongoose.Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    }, {
        id: string;
    }, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & Omit<{
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        method: "local" | "google" | "github";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
        deletedAt?: NativeDate | null;
    } & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google" | "github";
    email: string;
    isBanned: boolean;
    isDeleted: boolean;
    password?: string | null;
    refreshToken?: string | null;
    deletedAt?: NativeDate | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default User;
//# sourceMappingURL=UserModel.d.ts.map