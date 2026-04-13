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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
        }, mongoose.DefaultSchemaOptions> & Omit<{
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
        }, mongoose.DefaultSchemaOptions> & Omit<{
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
        }, mongoose.DefaultSchemaOptions> & Omit<{
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
    timestamps: true;
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
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
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
}, mongoose.DefaultSchemaOptions> & Omit<{
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
}, unknown, {
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
    createdAt: NativeDate;
    updatedAt: NativeDate;
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
} & mongoose.DefaultTimestampProps, {}, {
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
} & mongoose.DefaultTimestampProps, {
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
        }, mongoose.DefaultSchemaOptions> & Omit<{
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
        }, mongoose.DefaultSchemaOptions> & Omit<{
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
        }, mongoose.DefaultSchemaOptions> & Omit<{
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
    timestamps: true;
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
} & mongoose.DefaultTimestampProps & {
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
    }, mongoose.DefaultSchemaOptions> & Omit<{
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
        }, mongoose.DefaultSchemaOptions> & Omit<{
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
        }, mongoose.DefaultSchemaOptions> & Omit<{
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
        }, mongoose.DefaultSchemaOptions> & Omit<{
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
    timestamps: true;
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
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
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
}, mongoose.DefaultSchemaOptions> & Omit<{
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
}, unknown, {
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
    createdAt: NativeDate;
    updatedAt: NativeDate;
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
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default User;
//# sourceMappingURL=UserModel.d.ts.map