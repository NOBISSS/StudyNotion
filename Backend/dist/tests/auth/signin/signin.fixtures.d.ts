export declare const signinPayload: {
    email: string;
    password: string;
};
export declare const URL: string;
export declare function seedUser(overrides?: Partial<typeof signinPayload>): Promise<import("mongoose").Document<unknown, {}, {
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
} & import("mongoose").DefaultTimestampProps, {
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
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
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
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
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
        }, import("mongoose").DefaultSchemaOptions> & Omit<{
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
} & import("mongoose").DefaultTimestampProps & {
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
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
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
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
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
    }, import("mongoose").DefaultSchemaOptions> & Omit<{
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
//# sourceMappingURL=signin.fixtures.d.ts.map