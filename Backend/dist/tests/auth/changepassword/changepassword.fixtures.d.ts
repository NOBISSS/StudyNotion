export declare const URL: string;
export declare const changePasswordPayload: {
    oldPassword: string;
    newPassword: string;
};
export declare function seedAuthenticatedUser(overrides?: {
    email?: string;
}): Promise<{
    cookie: string;
    user: import("mongoose").Document<unknown, {}, {
        firstName: string;
        lastName: string;
        accountType: "student" | "instructor" | "admin";
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
    }, {
        id: string;
    }, {
        methods: {
            comparePassword(this: import("mongoose").Document<unknown, {}, {
                firstName: string;
                lastName: string;
                accountType: "student" | "instructor" | "admin";
                email: string;
                isBanned: boolean;
                isDeleted: boolean;
                password?: string | null;
                refreshToken?: string | null;
            }, {
                id: string;
            }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
                firstName: string;
                lastName: string;
                accountType: "student" | "instructor" | "admin";
                email: string;
                isBanned: boolean;
                isDeleted: boolean;
                password?: string | null;
                refreshToken?: string | null;
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
                email: string;
                isBanned: boolean;
                isDeleted: boolean;
                password?: string | null;
                refreshToken?: string | null;
            }, {
                id: string;
            }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
                firstName: string;
                lastName: string;
                accountType: "student" | "instructor" | "admin";
                email: string;
                isBanned: boolean;
                isDeleted: boolean;
                password?: string | null;
                refreshToken?: string | null;
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
                email: string;
                isBanned: boolean;
                isDeleted: boolean;
                password?: string | null;
                refreshToken?: string | null;
            }, {
                id: string;
            }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
                firstName: string;
                lastName: string;
                accountType: "student" | "instructor" | "admin";
                email: string;
                isBanned: boolean;
                isDeleted: boolean;
                password?: string | null;
                refreshToken?: string | null;
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
        email: string;
        isBanned: boolean;
        isDeleted: boolean;
        password?: string | null;
        refreshToken?: string | null;
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
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
        }, {
            id: string;
        }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
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
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
        }, {
            id: string;
        }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
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
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
        }, {
            id: string;
        }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<{
            firstName: string;
            lastName: string;
            accountType: "student" | "instructor" | "admin";
            email: string;
            isBanned: boolean;
            isDeleted: boolean;
            password?: string | null;
            refreshToken?: string | null;
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
    };
}>;
//# sourceMappingURL=changepassword.fixtures.d.ts.map