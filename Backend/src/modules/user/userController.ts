import bcrypt from "bcrypt";
import type { UploadApiResponse } from "cloudinary";
import { type CookieOptions } from "express";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import otpGenerator from "otp-generator";
import { z } from "zod";
import { type Handler, StatusCode } from "../../shared/types.js";
import { emailQueue } from "../../shared/queue/emailQueue.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../shared/utils/cloudinaryUpload.js";
import {
  canResendOTP,
  generateOTP,
  getOTPData,
  saveOTP,
  verifyOTP,
} from "../../shared/utils/otp.service.js";
import { Profile } from "./ProfileModel.js";
import User from "./UserModel.js";
import {
  changePasswordInputSchema,
  forgetInputSchema,
  signinInputSchema,
  signupInputSchema,
  userInputSchema,
} from "./userValidation.js";

export const signupWithOTP: Handler = async (req, res): Promise<void> => {
  try {
    const userInput = signupInputSchema.safeParse(req.body);
    if (!userInput.success) {
      res.status(StatusCode.InputError).json({
        message: userInput.error.issues?.[0]?.message || "Signup data required",
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

    const otp = await generateOTP();
    await saveOTP({
      email,
      otp,
      data: {
        password: await bcrypt.hash(password, 10),
        firstName,
        lastName,
        accountType,
        otpType: "registration",
      },
    });

    await emailQueue.add("send-otp", { email, otp });

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 20 * 60 * 1000, // 20 minutes
    };
    res
      .cookie("otp_data", { email, type: "signup" }, cookieOptions)
      .status(StatusCode.Success)
      .json({ message: "OTP sent successfully" });
    return;
  } catch (err: any) {
    console.log(err);
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const resendOTP: Handler = async (req, res): Promise<void> => {
  try {
    const { email } = req.cookies.otp_data;
    if (!email) {
      res.status(StatusCode.InputError).json({ message: "Invalid Request" });
      return;
    }

    const canResend = await canResendOTP(email);
    if (!canResend) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "Wait 2 minutes before sending OTP" });
      return;
    }

    const otp = generateOTP();
    const otpData = await getOTPData(email);
    if (!otpData) {
      res.status(StatusCode.NotFound).json({ message: "Invalid OTP request" });
      return;
    }
    await saveOTP({
      email,
      otp,
      data: {
        password: await bcrypt.hash(otpData.password || "", 10),
        firstName: otpData.firstName,
        lastName: otpData.lastName,
        accountType: otpData.accountType,
        otpType: otpData.otpType,
      },
    });

    await emailQueue.add("send-otp", { email, otp });
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 10 * 60000, // 10 minutes
    };
    res
      .cookie(
        "otp_data",
        {
          email: email,
          type: otpData.otpType === "registration" ? "signup" : "forget",
        },
        cookieOptions,
      )
      .status(StatusCode.Success)
      .json({ message: "OTP Reset Successfully" });
  } catch (err: any) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const signupOTPVerification: Handler = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.cookies.otp_data;

    if (!otp || !email) {
      return res
        .status(StatusCode.InputError)
        .json({ message: "Invalid Request" });
    }

    const otpData = await verifyOTP(email, otp, "registration");

    if (!otpData || otpData.otpType !== "registration") {
      return res
        .status(StatusCode.NotFound)
        .json({ message: "Invalid or Expired OTP" });
    }

    const user = await User.create({
      email,
      password: otpData.password as string,
      firstName: otpData.firstName as string,
      lastName: otpData.lastName as string,
      accountType: otpData.accountType as "admin" | "instructor" | "student",
    });

    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    await user.updateOne({ refreshToken });

    res
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .json({ message: "Signup successful", user });
  } catch (err: any) {
    res.status(StatusCode.ServerError).json({
      message: err.message || "Something went wrong from our side",
      err,
    });
    return;
  }
};
export const signin: Handler = async (req, res): Promise<void> => {
  try {
    const userInput = signinInputSchema.safeParse(req.body);
    if (!userInput.success) {
      res.status(StatusCode.InputError).json({
        message: userInput.error.issues?.[0]?.message || "Signin data required",
      });
      return;
    }
    const { email, password } = userInput.data;
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "User doesn't exist" });
      return;
    }
    if (user.isBanned) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "User is banned, Contact support" });
      return;
    }
    if (user.isDeleted) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "User is deleted, Contact support" });
      return;
    }
    const isPasswordCorrect = user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(StatusCode.InputError).json({ message: "Invalid password" });
      return;
    }
    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: <"none">"none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(StatusCode.Success)
      .json({ message: "signin successfull", user });
    return;
  } catch (err: any) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside" });
  }
};
export const getUser: Handler = async (req, res): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      res.status(StatusCode.NotFound).json({ message: "User not found" });
      return;
    }
    const userProfile = await Profile.findOne({
      userId: userId as Types.ObjectId,
    });
    res
      .status(StatusCode.Success)
      .json({ message: "user data fetched success", user, userProfile });
    return;
  } catch (err: any) {
    res
      .status(StatusCode.ServerError)
      .json({ message: err.message || "Something went wrong from ourside" });
  }
};
export const refreshTokens: Handler = async (req, res): Promise<void> => {
  try {
    const IRefreshToken = req.cookies?.refreshToken;
    if (!IRefreshToken) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Refresh token is empty" });
      return;
    }
    const decodedToken = jwt.verify(
      IRefreshToken,
      <string>process.env.JWT_REFRESH_TOKEN_SECRET,
    );
    if (!decodedToken) {
      res.status(StatusCode.Unauthorized).json({ message: "Unauthorized" });
      return;
    }
    //@ts-ignore
    const user = await User.findById(decodedToken._id);
    if (!user) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Invalid refresh Token" });
      return;
    }
    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: <"none">"none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .status(StatusCode.Success)
      .json({ message: "Access token refreshed" });
    return;
  } catch (err: any) {
    res
      .status(StatusCode.Unauthorized)
      .json({ message: err.message || "Something went wrong from ourside" });
  }
};
export const signout: Handler = async (req, res): Promise<void> => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: <"none">"none",
      path: "/",
      maxAge: 0, // 1 day
    };
    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(StatusCode.Success)
      .json({ message: "user signout success" });
    return;
  } catch (err: any) {
    res
      .status(StatusCode.ServerError)
      .json({ message: err.message || "Something went wrong from ourside" });
  }
};
export const changePassword: Handler = async (req, res): Promise<void> => {
  try {
    const userId = req.userId;
    const parsedPasswords = changePasswordInputSchema.safeParse(req.body);
    if (!parsedPasswords.success) {
      res.status(StatusCode.InputError).json({
        message:
          parsedPasswords.error?.issues[0]?.message || "Username is required",
      });
      return;
    }
    const { oldPassword, newPassword } = parsedPasswords.data;
    const user = await User.findById(userId);
    if (!user) {
      res.status(StatusCode.NotFound).json({ message: "User not found" });
      return;
    }
    const isOldPasswordCorrect = user.comparePassword(oldPassword);
    if (!isOldPasswordCorrect) {
      res
        .status(StatusCode.InputError)
        .json({ message: "Old password is incorrect" });
      return;
    }
    await User.updateOne(
      { _id: userId },
      { $set: { password: bcrypt.hashSync(newPassword, 10) } },
    );
    const updatedUser = await User.findById(userId).select(
      "-password -refreshToken",
    );
    res
      .status(StatusCode.Success)
      .json({ message: "Password updated successfully", user: updatedUser });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", error: err });
    return;
  }
};
export const forgetWithOTPRedis: Handler = async (req, res): Promise<void> => {
  try {
    const userEmail = z.email({ message: "Invalid email address" });
    const userInput = userEmail.safeParse(req.body.email);
    if (!userInput.success) {
      res.status(StatusCode.InputError).json({
        message: userInput.error?.issues[0]?.message || "Invalid email address",
      });
      return;
    }
    const email = userInput.data;
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "User not found with this email" });
      return;
    }
    const otp = generateOTP();
    await saveOTP({
      email,
      otp,
      data: {
        otpType: "forget",
      },
    });

    await emailQueue.add("send-otp", { email, otp });
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 10 * 60000, // 10 minutes
    };
    res
      .cookie("otp_data", { email: email, type: "forget" }, cookieOptions)
      .status(200)
      .json({ message: "OTP sent successfully" });
    return;
  } catch (err: any) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const forgetOTPVerificationRedis: Handler = async (
  req,
  res,
): Promise<void> => {
  try {
    const parsedInput = forgetInputSchema.safeParse(req.body);
    if (!parsedInput.success) {
      res.status(StatusCode.NotFound).json({
        message:
          parsedInput.error?.issues[0]?.message || "OTP/Password is required",
      });
      return;
    }
    const { otp, password } = parsedInput.data;
    const { email } = req.cookies.otp_data;
    const otpData = await verifyOTP(email, otp.toString(), "forget");

    if (!otpData || otpData.otpType !== "forget") {
      res.status(StatusCode.NotFound).json({ message: "Invalid OTP" });
      return;
    }

    await User.updateOne(
      { email },
      {
        $set: {
          password: bcrypt.hashSync(password, 10),
        },
      },
    );
    // const cookieOptions: CookieOptions = {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   path: "/",
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    // };
    res
      .status(StatusCode.Success)
      // .cookie("accessToken", accessToken, cookieOptions)
      // .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        message: "password changed successfully",
        // user,
      });
    return;
  } catch (err: any) {
    res.status(StatusCode.ServerError).json({
      message: err.message || "Something went wrong from our side",
      err,
    });
    return;
  }
};
export const updateProfile: Handler = async (req, res): Promise<void> => {
  try {
    const userId = req.userId;
    const updateProfileInput = userInputSchema.safeParse(req.body);
    if (!updateProfileInput.success) {
      res.status(StatusCode.InputError).json({
        message:
          updateProfileInput.error?.issues[0]?.message ||
          "Invalid profile data",
      });
      return;
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
      res.status(StatusCode.Success).json({
        message: "Profile updated successfully",
        user: updatedUser,
        profile: updatedProfile,
      });
      return;
    } catch (error) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "Username already taken" });
      return;
    }
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", error: err });
    return;
  }
};
export const deleteAccount: Handler = async (req, res): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await User.findByIdAndUpdate(userId, {
      $set: { isDeleted: true },
    });
    if (!user) {
      res.status(StatusCode.NotFound).json({ message: "User not found" });
      return;
    }
    res
      .status(StatusCode.Success)
      .json({ message: "Account deleted successfully" });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", error: err });
    return;
  }
};
export const banUser: Handler = async (req, res): Promise<void> => {
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
export const updateProfilePhoto: Handler = async (req, res): Promise<void> => {
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
export const createUser: Handler = async (req, res): Promise<void> => {
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
    res.status(StatusCode.Success).json({ message: "User created successfully", user });
    return;
  } catch (err) {
    res.status(StatusCode.ServerError).json({ message: "Something went wrong from ourside", error: err });
    return;
  }
}
export const getUsers: Handler = async (req, res): Promise<void> => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(StatusCode.Success).json({ message: "Users fetched successfully", users });
    return;
  } catch (err) {
    res.status(StatusCode.ServerError).json({ message: "Something went wrong from ourside", error: err });
    return;
  }
}
export const getInstructors: Handler = async (req, res): Promise<void> => {
  try {
    const users = await User.find({ accountType: "instructor" }).select("-password -refreshToken");
    res.status(StatusCode.Success).json({ message: "Instructors fetched successfully", users });
    return;
  } catch (err) {
    res.status(StatusCode.ServerError).json({ message: "Something went wrong from ourside", error: err });
    return;
  }
}