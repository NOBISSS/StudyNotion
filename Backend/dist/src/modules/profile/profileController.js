import bcrypt from "bcrypt";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { Profile } from "../user/ProfileModel.js";
import User from "../user/UserModel.js";
import { changePasswordInputSchema } from "./profileValidation.js";
export const getUser = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const user = req.user;
    if (!user) {
        throw AppError.notFound("User not found");
    }
    const userProfile = await Profile.findOne({
        userId: userId,
    });
    return ApiResponse.success(res, {
        user: {
            ...user.toObject(),
            password: undefined,
            refreshToken: undefined,
            additionalDetails: userProfile,
        },
    }, "User fetched successfully");
});
export const changePassword = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const parsedPasswords = changePasswordInputSchema.safeParse(req.body);
    if (!parsedPasswords.success) {
        throw AppError.badRequest(parsedPasswords.error?.issues[0]?.message || "Invalid input data");
    }
    const { oldPassword, newPassword } = parsedPasswords.data;
    const user = await User.findById(userId);
    if (!user) {
        throw AppError.notFound("User not found");
    }
    const isOldPasswordCorrect = user.comparePassword(oldPassword);
    if (!isOldPasswordCorrect) {
        throw AppError.badRequest("Old password is incorrect");
    }
    await User.updateOne({ _id: userId }, { $set: { password: bcrypt.hashSync(newPassword, 10) } });
    const updatedUser = await User.findById(userId).select("-password -refreshToken");
    return ApiResponse.success(res, { user: updatedUser }, "Password changed successfully");
});
export const deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const user = await User.findByIdAndUpdate(userId, {
        $set: { isDeleted: true },
    });
    if (!user) {
        throw AppError.notFound("User not found");
    }
    return ApiResponse.success(res, {}, "Account deleted successfully");
});
export const deleteProfile = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const profile = await Profile.findOneAndUpdate({ userId: userId }, { $set: { isDeleted: true } });
    if (!profile) {
        throw AppError.notFound("Profile not found");
    }
    await Profile.create({
        userId: userId,
        about: "",
        city: "",
        country: "",
        contactNumber: null,
        gender: "",
        profilePicture: "",
        birthdate: null,
    });
    return ApiResponse.success(res, {}, "Profile deleted successfully");
});
//# sourceMappingURL=profileController.js.map