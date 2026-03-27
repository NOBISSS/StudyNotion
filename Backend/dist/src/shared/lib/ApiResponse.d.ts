import { type Response } from "express";
import type { CookieType } from "../types.js";
interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare class ApiResponse {
    static success<T>(res: Response, data: T, message?: string, statusCode?: number, cookies?: CookieType[]): Response;
    static created<T>(res: Response, data: T, message?: string, cookies?: CookieType[]): Response;
    static paginated<T>(res: Response, data: T[], pagination: PaginationMeta, message?: string): Response;
    static noContent(res: Response): Response;
}
export {};
//# sourceMappingURL=ApiResponse.d.ts.map