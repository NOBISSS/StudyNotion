import { jest } from "@jest/globals";
import "../otp.mocks.js";
declare const verifyOTP: ({ email, userOtp, otpType, }: {
    email: string;
    userOtp: string;
    otpType: "registration" | "forgot";
}) => Promise<import("../../../src/shared/utils/otp.service.js").OTPData | null>;
export declare const verifyPayload: {
    otp: number;
    password: string;
};
export declare const URL: string;
export declare const mockVerifyOTP: jest.MockedFunction<typeof verifyOTP>;
export declare const mockOtpData: {
    otp: string;
    otpType: "forgot";
};
export declare function buildOtpCookie(overrides?: {
    email?: string;
    type?: string;
}): string;
export declare function seedUser(overrides?: {
    email?: string;
}): Promise<import("mongoose").Document<unknown, {}, {
    firstName: string;
    lastName: string;
    accountType: "student" | "instructor" | "admin";
    method: "local" | "google";
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
            method: "local" | "google";
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
            method: "local" | "google";
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
            method: "local" | "google";
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
            method: "local" | "google";
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
            method: "local" | "google";
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
            method: "local" | "google";
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
    method: "local" | "google";
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
        method: "local" | "google";
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
        method: "local" | "google";
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
        method: "local" | "google";
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
        method: "local" | "google";
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
        method: "local" | "google";
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
        method: "local" | "google";
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
}>;
export {};
//# sourceMappingURL=forgotpassword-verification.fixtures.d.ts.map