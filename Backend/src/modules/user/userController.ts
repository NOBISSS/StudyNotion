import bcrypt from "bcrypt";
import type { UploadApiResponse } from "cloudinary";
import type { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { type Handler, StatusCode } from "../../shared/types.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../shared/utils/cloudinaryUpload.js";
import { Profile } from "./ProfileModel.js";
import User from "./UserModel.js";
import { userInputSchema } from "./userValidation.js";
import { signupInputSchema } from "../auth/authValidation.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const updateProfileInput = userInputSchema.safeParse(req.body);
  if (!updateProfileInput.success) {
    throw AppError.badRequest(
      updateProfileInput.error?.issues[0]?.message || "Invalid input data",
    );
  }
  const {
    firstName,
    lastName,
    contactNumber,
    gender,
    city,
    country,
    birthdate,
    about,
  } = updateProfileInput.data;
  try {
    await User.updateOne({ _id: userId }, { $set: { firstName, lastName } });
    const updatedProfile = await Profile.updateOne(
      { userId: userId as Types.ObjectId },
      {
        $set: {
          about,
          contactNumber,
          gender,
          city,
          country,
          birthdate,
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
export const banUser: Handler = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(StatusCode.NotFound).json({ message: "User not found" });
      return;
    }
    await user.updateOne({ isBanned: !user.isBanned });
    res.status(StatusCode.Success).json({
      message: `Account ${user.isBanned ? "unbanned" : "banned"} successfully`,
    });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", error: err });
    return;
  }
};
export const updateProfilePhoto: Handler = async (req, res) => {
  let avatar: UploadApiResponse | null = null;
  try {
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

    res
      .status(StatusCode.Success)
      .json({ message: "Profile photo updated successfully" });
    return;
  } catch (err) {
    if (avatar) await deleteFromCloudinary(avatar.public_id);
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", error: err });
    return;
  }
};
export const createUser: Handler = async (req, res) => {
  try {
    const userInput = signupInputSchema.safeParse(req.body);
    if (!userInput.success) {
      res.status(StatusCode.InputError).json({
        message: userInput.error.issues?.[0]?.message || "User data required",
      });
      return;
    }
    const { email, password, firstName, lastName, accountType } =
      userInput.data;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "User already exists with this username or email" });
      return;
    }
    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName,
      accountType,
    });
    res
      .status(StatusCode.Success)
      .json({ message: "User created successfully", user });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", error: err });
    return;
  }
};
export const getUsers: Handler = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res
      .status(StatusCode.Success)
      .json({ message: "Users fetched successfully", users });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", error: err });
    return;
  }
};
export const getInstructors: Handler = async (req, res) => {
  try {
    const users = await User.find({ accountType: "instructor" }).select(
      "-password -refreshToken",
    );
    res
      .status(StatusCode.Success)
      .json({ message: "Instructors fetched successfully", users });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", error: err });
    return;
  }
};
export const getStudents: Handler = async (req, res) => {
  try {
    const users = await User.find({ accountType: "student" }).select(
      "-password -refreshToken",
    );
    res
      .status(StatusCode.Success)
      .json({ message: "Students fetched successfully", users });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", error: err });
    return;
  }
};
