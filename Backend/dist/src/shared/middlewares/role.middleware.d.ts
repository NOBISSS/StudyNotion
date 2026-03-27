import type { NextFunction, Request, Response } from "express";
import { type Role } from "../constants.js";
export declare const authorizeRoles: (...roles: Role[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map