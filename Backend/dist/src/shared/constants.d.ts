import type { CookieOptions } from "express";
export declare const MATERIAL_MAX_FILE_SIZE: number;
export declare const accessTokenCookieOptions: CookieOptions;
export declare const refreshTokenCookieOptions: CookieOptions;
export declare const logoutCookieOptions: CookieOptions;
export declare const OTPDatacookieOptions: CookieOptions;
export declare const ROLES: {
    readonly STUDENT: "student";
    readonly INSTRUCTOR: "instructor";
    readonly ADMIN: "admin";
};
export type Role = (typeof ROLES)[keyof typeof ROLES];
export declare const NODE_ENV: string;
//# sourceMappingURL=constants.d.ts.map