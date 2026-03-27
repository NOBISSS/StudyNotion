import {} from "express";
import User from "../../modules/user/UserModel.js";
import { AppError } from "../lib/AppError.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { tokenService } from "../services/token.service.js";
export const userMiddleware = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    const decodedToken = tokenService.verifyAccessToken(accessToken);
    if (!decodedToken) {
        throw AppError.unauthorized("Unauthorized");
    }
    const user = await User.findById(decodedToken._id).select("-password -refreshToken -__v");
    if (!user) {
        throw AppError.unauthorized("Unauthorized");
    }
    req.userId = user._id;
    req.user = user;
    req.accountType = user.accountType;
    next();
});
export const isStudent = asyncHandler(async (req, res, next) => {
    if (req.accountType == "admin") {
        next();
        return;
    }
    if (req.accountType !== "student") {
        throw AppError.unauthorized("Only students are allowed to access this route");
    }
    next();
});
export const isInstructor = asyncHandler(async (req, res, next) => {
    if (req.accountType == "admin" || req.accountType == "instructor") {
        next();
        return;
    }
    if (req.accountType == "student") {
        throw AppError.unauthorized("Only instructors are allowed to access this route");
    }
    next();
});
export const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.accountType !== "admin") {
        throw AppError.unauthorized("Only admins are allowed to access this route");
    }
    next();
});
//# sourceMappingURL=userMiddleware.js.map