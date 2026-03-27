import { type CookieOptions, type NextFunction, type Request, type Response } from "express";
import type { Document, Types } from "mongoose";
export type Handler = (req: Request, res: Response, next: NextFunction) => any;
export declare enum StatusCode {
    Success = 200,
    InputError = 411,
    DocumentExists = 403,
    ServerError = 500,
    NotFound = 404,
    Unauthorized = 401
}
export type CookieType = {
    name: string;
    value: string;
    options: CookieOptions;
};
export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: "student" | "instructor" | "admin";
    refreshToken?: string | null;
    isBanned: boolean;
    isDeleted: boolean;
}
//# sourceMappingURL=types.d.ts.map