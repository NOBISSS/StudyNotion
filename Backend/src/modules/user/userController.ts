import bcrypt from "bcrypt";
import type { UploadApiResponse } from "cloudinary";
import type { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { StatusCode } from "../../shared/types.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../shared/utils/cloudinaryUpload.js";
import { signupInputSchema } from "../auth/authValidation.js";
import { Profile } from "./ProfileModel.js";
import User from "./UserModel.js";
import { updateProfileSchema } from "./userValidation.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const updateProfileInput = updateProfileSchema.safeParse(req.body);
  if (!updateProfileInput.success) {
    throw AppError.badRequest(
      updateProfileInput.error?.issues[0]?.message || "Invalid input data",
    );
  }
  const { additionalDetails } = updateProfileInput.data;
  try {
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          firstName: additionalDetails.firstName,
          lastName: additionalDetails.lastName,
        },
      },
    );
    const updatedProfile = await Profile.updateOne(
      { userId: userId as Types.ObjectId },
      {
        $set: {
          about: additionalDetails.about,
          contactNumber: additionalDetails.contactNumber,
          gender: additionalDetails.gender,
          city: additionalDetails.city,
          country: additionalDetails.country,
          birthdate: additionalDetails.birthdate,
        },
      },
    );
    const updatedUser = await User.findById(userId).select(
      "-password -refreshToken",
    );
    return ApiResponse.success(
      res,
      { user: updatedUser, profile: updatedProfile },
      "Profile updated successfully",
    );
  } catch (error) {
    throw AppError.conflict("Username already taken");
  }
});
export const banUser = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound("User not found");
  }
  await user.updateOne({ isBanned: !user.isBanned });
  ApiResponse.success(res, {
    message: `Account ${user.isBanned ? "unbanned" : "banned"} successfully`,
  });
});
export const updateProfilePhoto = asyncHandler(async (req, res) => {
  let avatar: UploadApiResponse | null = null;
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
  const profile = await Profile.findOneAndUpdate(
    { userId: req.userId! },
    { profilePicture: avatar.secure_url },
    { new: true },
  );
  if (!profile) {
    if (avatar) await deleteFromCloudinary(avatar.public_id);
    throw AppError.notFound("Profile not found");
  }
  ApiResponse.success(res, {
    profile,
    message: "Profile picture updated successfully",
  });
});
export const createUser = asyncHandler(async (req, res) => {
  const userInput = signupInputSchema.safeParse(req.body);
  if (!userInput.success) {
    throw AppError.badRequest(
      userInput.error.issues[0]?.message || "Invalid input data",
    );
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
  ApiResponse.created(res, { message: "User created successfully", user });
});
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  ApiResponse.success(res, { message: "Users fetched successfully", users });
});
export const getInstructors = asyncHandler(async (req, res) => {
  const users = await User.find({ accountType: "instructor" }).select(
    "-password -refreshToken",
  );
  ApiResponse.success(res, {
    message: "Instructors fetched successfully",
    users,
  });
});
export const getStudents = asyncHandler(async (req, res) => {
  const users = await User.find({ accountType: "student" }).select(
    "-password -refreshToken",
  );
  ApiResponse.success(res, { message: "Students fetched successfully", users });
});
