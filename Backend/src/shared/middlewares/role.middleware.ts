import type { NextFunction, Request, Response } from "express";
import { ROLES, type Role } from "../constants.js";
import { AppError } from "../lib/AppError.js";

export const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    const isAdmin = req.user.accountType === ROLES.ADMIN;
    const hasRole = roles.includes(req.user.accountType);

    if (!isAdmin && !hasRole) {
      throw AppError.forbidden(
        "You do not have permission to access this resource",
      );
    }

    next();
  };
};
