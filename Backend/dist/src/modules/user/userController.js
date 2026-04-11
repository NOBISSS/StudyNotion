import bcrypt from "bcryptjs";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { StatusCode } from "../../shared/types.js";
import { deleteFromCloudinary, uploadToCloudinary, } from "../../shared/utils/cloudinaryUpload.js";
import { forgetOTPVerificationSchema, signupInputSchema } from "../auth/authValidation.js";
import { Profile } from "./ProfileModel.js";
import User from "./UserModel.js";
import { updateProfileSchema } from "./userValidation.js";
import { generateOTP, saveOTP, verifyOTP } from "../../shared/utils/otp.service.js";
import { OTPDatacookieOptions } from "../../shared/constants.js";
import { emailQueue } from "../../shared/queue/emailQueue.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
import { Course } from "../course/CourseModel.js";
export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const updateProfileInput = updateProfileSchema.safeParse(req.body);
    if (!updateProfileInput.success) {
        throw AppError.badRequest(updateProfileInput.error?.issues[0]?.message || "Invalid input data");
    }
    const { additionalDetails, firstName, lastName } = updateProfileInput.data;
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, {
            $set: {
                firstName: firstName,
                lastName: lastName,
            },
        }, { returnDocument: "after" }).select("-password -refreshToken");
        if (!updatedUser) {
            throw AppError.notFound("User not found");
        }
        let updatedProfile = await Profile.findOneAndUpdate({ userId: userId }, {
            $set: {
                about: additionalDetails.about,
                contactNumber: additionalDetails.contactNumber,
                gender: additionalDetails.gender,
                city: additionalDetails.city,
                country: additionalDetails.country,
                birthdate: new Date(additionalDetails.dateOfBirth || ""),
            },
        }, { returnDocument: "after" });
        if (!updatedProfile) {
            updatedProfile = await Profile.create({
                userId: userId,
                about: additionalDetails.about || "",
                contactNumber: additionalDetails.contactNumber || null,
                gender: additionalDetails.gender || "other",
                city: additionalDetails.city || "",
                country: additionalDetails.country || "",
                birthdate: new Date(additionalDetails.dateOfBirth || ""),
            });
        }
        return ApiResponse.success(res, {
            user: {
                ...updatedUser.toObject(),
                additionalDetails: updatedProfile.toObject(),
                password: undefined,
                refreshToken: undefined,
            },
        }, "Profile updated successfully");
    }
    catch (error) {
        if (error?.code === 11000)
            throw AppError.conflict("Username already taken");
        else
            throw AppError.internal("Something went wrong while updating the profile");
    }
});
export const banUser = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
        throw AppError.notFound("User not found");
    }
    await user.updateOne({ isBanned: !user.isBanned });
    ApiResponse.success(res, {}, `User has been ${user.isBanned ? "unbanned" : "banned"} successfully`);
});
export const updateProfilePhoto = asyncHandler(async (req, res) => {
    let avatar = null;
    const user = req.user;
    const profilePicture = req.file;
    if (!profilePicture) {
        res
            .status(StatusCode.InputError)
            .json({ message: "Profile picture is required" });
        return;
    }
    avatar = await uploadToCloudinary(Buffer.from(profilePicture.buffer));
    if (!avatar) {
        res
            .status(StatusCode.ServerError)
            .json({ message: "Failed to upload avatar" });
        return;
    }
    const profile = await Profile.findOneAndUpdate({ userId: req.userId }, { profilePicture: avatar.secure_url }, { returnDocument: "after" });
    if (!profile) {
        if (avatar)
            await deleteFromCloudinary(avatar.public_id);
        throw AppError.notFound("Profile not found");
    }
    ApiResponse.success(res, {
        user: {
            ...user.toObject(),
            additionalDetails: profile.toObject(),
            password: undefined,
            refreshToken: undefined,
        },
    }, "Profile picture updated successfully");
});
export const createUser = asyncHandler(async (req, res) => {
    const userInput = signupInputSchema.safeParse(req.body);
    if (!userInput.success) {
        throw AppError.badRequest(userInput.error.issues[0]?.message || "Invalid input data");
    }
    const { email, password, firstName, lastName, accountType } = userInput.data;
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw AppError.conflict("User with this email already exists");
    }
    const user = await User.create({
        email,
        password: await bcrypt.hash(password, 10),
        firstName,
        lastName,
        accountType,
    });
    ApiResponse.created(res, { user }, "User created successfully");
});
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");
    ApiResponse.success(res, { users }, "Users fetched successfully");
});
export const getInstructors = asyncHandler(async (req, res) => {
    const users = await User.find({ accountType: "instructor" }).select("-password -refreshToken");
    ApiResponse.success(res, { users }, "Instructors fetched successfully");
});
export const getStudents = asyncHandler(async (req, res) => {
    const users = await User.find({ accountType: "student" }).select("-password -refreshToken");
    ApiResponse.success(res, { users }, "Students fetched successfully");
});
export const reactivateAccount = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw AppError.badRequest("Email is required");
    }
    const user = await User.findOne({
        email: email.toLowerCase(),
    });
    if (!user) {
        throw AppError.notFound("User not found with this email");
    }
    if (!user.isDeleted) {
        throw AppError.badRequest("This account is not deactivated");
    }
    const otp = generateOTP();
    await saveOTP({
        email,
        otp,
        data: {
            otpType: "recovery",
        },
    });
    await emailQueue.add("send-otp", { email, otp });
    return ApiResponse.success(res, { email }, "OTP sent successfully", StatusCode.Success, [
        {
            name: "otp_data",
            value: JSON.stringify({ email, type: "recovery" }),
            options: OTPDatacookieOptions,
        },
    ]);
});
export const reactivateAccountOTPVerification = asyncHandler(async (req, res) => {
    const parsedInput = forgetOTPVerificationSchema.safeParse(req.body);
    if (!parsedInput.success) {
        throw AppError.badRequest(parsedInput.error?.issues[0]?.message || "OTP/Password is required");
    }
    const { otp } = parsedInput.data;
    const { email, type } = JSON.parse(req.cookies.otp_data);
    if (!email || type !== "recovery") {
        throw AppError.badRequest("Invalid Request");
    }
    const lowerCaseEmail = email.toLowerCase();
    const otpData = await verifyOTP({
        email: lowerCaseEmail,
        userOtp: otp.toString(),
        otpType: "recovery",
    });
    if (!otpData || otpData.otpType !== "recovery") {
        throw AppError.badRequest("Invalid OTP");
    }
    const user = await User.findOne({ email: lowerCaseEmail, isDeleted: true });
    if (!user) {
        throw AppError.notFound("User not found with this email");
    }
    user.isDeleted = false;
    user.deletedAt = null;
    await user.save();
    await CourseEnrollment.updateMany({ userId: user._id }, { $set: { isActive: true } });
    await Profile.findOneAndUpdate({ userId: user._id }, { $set: { isDeleted: false } });
    const isInstructor = user.accountType === "instructor";
    if (isInstructor) {
        const orphanedCourses = await Course.updateMany({ instructorId: user._id, isOrphaned: true }, {
            $set: {
                isOrphaned: false,
                instructorName: `${user.firstName} ${user.lastName}`,
            }
        });
        await Course.updateMany({ instructorId: user._id, status: "Removed" }, { $set: { status: "Draft", isActive: true } });
    }
    return ApiResponse.success(res, {}, "Account reactivated successfully", StatusCode.Success);
});
//# sourceMappingURL=userController.js.map