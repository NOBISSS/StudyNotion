export declare const URL: string;
export declare const forgotPasswordPayload: {
    email: string;
};
export declare function seedUser(overrides?: {
    email?: string;
}): Promise<import("mongoose").Document<unknown, {}, {
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
        comparePassword(this: import("mongoose").Document<unknown, {}, {
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
        }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
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
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, inputPassword: string): boolean;
        hashPassword(this: import("mongoose").Document<unknown, {}, {
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
        }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
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
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        }, inputPassword: string): Promise<void>;
        generateAccessAndRefreshToken(this: import("mongoose").Document<unknown, {}, {
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
        }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
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
            _id: import("mongoose").Types.ObjectId;
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
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id" | "comparePassword" | "hashPassword" | "generateAccessAndRefreshToken"> & {
    id: string;
} & {
    comparePassword: (this: import("mongoose").Document<unknown, {}, {
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
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, inputPassword: string) => boolean;
    hashPassword: (this: import("mongoose").Document<unknown, {}, {
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
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, inputPassword: string) => Promise<void>;
    generateAccessAndRefreshToken: (this: import("mongoose").Document<unknown, {}, {
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
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
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
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) => {
        accessToken: string;
        refreshToken: string;
    };
}>;
//# sourceMappingURL=forgotpassword.fixtures.d.ts.map