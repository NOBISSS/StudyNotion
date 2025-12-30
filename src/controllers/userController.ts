import bcrypt from "bcrypt";
import type { UploadApiResponse } from "cloudinary";
import { type CookieOptions, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import otpGenerator from "otp-generator";
import { z } from "zod";
import { OTP } from "../models/OTPModel.js";
import { Profile } from "../models/ProfileModel.js";
import User from "../models/UserModel.js";
import { type Handler, StatusCode } from "../types.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinaryUpload.js";

const userInputSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be atleast 3 characters" })
    .optional(),
  lastName: z
    .string()
    .min(3, { message: "Last name must be atleast 3 characters" })
    .optional(),
  about: z.string().optional(),
  contactNumber: z.number().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  birthdate: z.date().optional(),
});
const forgetInputSchema = z.object({
  otp: z.number(),
  password: z
    .string()
    .regex(/[A-Z]/, {
      message: "Pasword should include atlist 1 uppercasecharacter",
    })
    .regex(/[a-z]/, {
      message: "Pasword should include atlist 1 lowercasecharacter",
    })
    .regex(/[0-9]/, {
      message: "Pasword should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Pasword should include atlist 1 special character",
    })
    .min(8, { message: "Password length shouldn't be less than 8" }),
});
const signupInputSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be atleast 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be atleast 3 characters" }),
  accountType: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .regex(/[A-Z]/, {
      message: "Pasword should include atlist 1 uppercasecharacter",
    })
    .regex(/[a-z]/, {
      message: "Pasword should include atlist 1 lowercasecharacter",
    })
    .regex(/[0-9]/, {
      message: "Pasword should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Pasword should include atlist 1 special character",
    })
    .min(8, { message: "Password length shouldn't be less than 8" }),
});
const signinInputSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});
export const signupWithOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const isUsernameAvailable = await User.findOne({ email });
    if (isUsernameAvailable) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "User already exists with this username or email" });
      return;
    }
    const isOTPExists = await OTP.findOne({ email, type: "signup" })
      .sort({ createdAt: -1 })
      .limit(1);
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 20 * 60000, // 20 minutes
    };
    if (isOTPExists) {
      const otpCreatedTime = new Date(isOTPExists.createdAt);
      if (new Date().getTime() - otpCreatedTime.getTime() <= 120000) {
        await OTP.deleteMany({ email, type: "signup" });
        const newOtp = await OTP.create({
          email,
          otp: isOTPExists.otp,
          subject: "OTP for user signup",
          password: bcrypt.hashSync(password, 10),
          firstName,
          lastName,
          accountType,
          type: "signup",
        });
        res
          .cookie(
            "otp_data",
            { email: newOtp.email, type: "signup" },
            cookieOptions
          )
          .status(200)
          .json({ message: "OTP sent successfully" });
        return;
      }
    }
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const newOtp = await OTP.create({
      email,
      otp: Number(otp),
      subject: "OTP for user signup",
      password: bcrypt.hashSync(password, 10),
      firstName,
      lastName,
      accountType,
      type: "signup",
    });
    if (!newOtp) {
      res.status(500).json({ message: "OTP not generated" });
      return;
    }
    res
      .cookie(
        "otp_data",
        { email: newOtp.email, type: "signup" },
        cookieOptions
      )
      .status(200)
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
export const resenedOTP: Handler = async (req, res): Promise<void> => {
  try {
    const otpData = req.cookies.otp_data;
    if (!otpData || !otpData.email || !otpData.type) {
      res.status(StatusCode.InputError).json({
        message: "Invalid email address",
      });
      return;
    }
    const isUserExists = await User.findOne({ email: otpData.email });
    if (isUserExists) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "User already exists with this email" });
      return;
    }
    const isOTPExists = await OTP.findOne({
      email: otpData.email,
      type: otpData.type,
    })
      .sort({ createdAt: -1 })
      .limit(1);
    if (
      isOTPExists &&
      new Date().getTime() - new Date(isOTPExists.createdAt).getTime() <= 600000
    ) {
      const otpCreatedTime = new Date(isOTPExists.createdAt);
      if (new Date().getTime() - otpCreatedTime.getTime() <= 120000) {
        res
          .status(StatusCode.DocumentExists)
          .json({ message: "Wait for 2 minutes before sending new OTP" });
        return;
      }
    }
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const newOtp = await OTP.create({
      email: otpData.email,
      otp: Number(otp),
      subject: `OTP for user ${otpData.type}`,
      password: isOTPExists?.password || "",
      firstName: isOTPExists?.firstName || "",
      lastName: isOTPExists?.lastName || "",
      accountType: isOTPExists?.accountType || "",
      type: otpData.type,
      createdAt: new Date(),
    });
    if (!newOtp) {
      res.status(500).json({ message: "OTP not generated" });
      return;
    }
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 20 * 60000, // 20 minutes
    };
    res
      .cookie(
        "otp_data",
        { email: newOtp.email, type: newOtp.type },
        cookieOptions
      )
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
export const signupOTPVerification: Handler = async (
  req,
  res
): Promise<void> => {
  try {
    const parsedOTP = Number(req.body.otp);
    if (!parsedOTP) {
      res.status(StatusCode.NotFound).json({ message: "OTP not found" });
      return;
    }
    const { email } = req.cookies.otp_data;
    const IsOtpExists = await OTP.find({ email: email, type: "signup" })
      .sort({ createdAt: -1 })
      .limit(1);
    if (IsOtpExists.length === 0 || parsedOTP !== IsOtpExists[0]?.otp) {
      res.status(StatusCode.NotFound).json({
        message: "Invalid OTP",
      });
      return;
    }
    const newUser = await User.create({
      firstName: IsOtpExists[0].firstName || "",
      lastName: IsOtpExists[0].lastName || "",
      accountType: IsOtpExists[0].accountType || "",
      email,
      password: IsOtpExists[0].password || "",
    });
    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      res
        .status(StatusCode.ServerError)
        .json({ message: "Something went wrong from our side." });
      return;
    }
    await OTP.deleteMany({ email, type: "signup" });
    const { accessToken, refreshToken } =
      createdUser.generateAccessAndRefreshToken();
    await createdUser.updateOne(
      { email },
      {
        $set: {
          refreshToken,
        },
      }
    );
    await Profile.create({ userId: createdUser._id });
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    res
      .status(StatusCode.Success)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        message: "User signup successfull",
        user: createdUser,
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
      <string>process.env.JWT_REFRESH_TOKEN_SECRET
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
const changePasswordInputSchema = z.object({
  oldPassword: z.string({ error: "Old password is required" }),
  newPassword: z
    .string()
    .min(8, { message: "New Password length shouldn't be less than 8" })
    .regex(/[A-Z]/, {
      message: "New Pasword should include atlist 1 uppercasecharacter",
    })
    .regex(/[a-z]/, {
      message: "New Pasword should include atlist 1 lowercasecharacter",
    })
    .regex(/[0-9]/, {
      message: "New Pasword should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "New Pasword should include atlist 1 special character",
    }),
});
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
      { $set: { password: bcrypt.hashSync(newPassword, 10) } }
    );
    const updatedUser = await User.findById(userId).select(
      "-password -refreshToken"
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
export const forgetWithOTP: Handler = async (req, res): Promise<void> => {
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
    const isOTPExists = await OTP.findOne({ email, type: "forget" })
      .sort({ createdAt: -1 })
      .limit(1);
    if (isOTPExists) {
      const otpCreatedTime = new Date(isOTPExists.createdAt);
      if (new Date().getTime() - otpCreatedTime.getTime() <= 120000) {
        res
          .status(StatusCode.DocumentExists)
          .json({ message: "Wait for 2 minutes before sending new OTP" });
        return;
      }
    }
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const newOtp = await OTP.create({
      email,
      otp: Number(otp),
      subject: "OTP for forget password",
      type: "forget",
      firstName: user.firstName,
      lastName: user.lastName,
    });
    if (!newOtp) {
      res.status(500).json({ message: "OTP not generated" });
      return;
    }
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
        { email: newOtp.email, type: "forget" },
        cookieOptions
      )
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
export const forgetOTPVerification: Handler = async (
  req,
  res
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
    const IsOtpExists = await OTP.find({ email: email, type: "forget" })
      .sort({ createdAt: -1 })
      .limit(1);
    if (IsOtpExists.length === 0 || otp !== IsOtpExists[0]?.otp) {
      res.status(StatusCode.NotFound).json({
        message: "Invalid OTP",
      });
      return;
    }
    await OTP.deleteMany({ email, type: "forget" });
    await User.updateOne(
      { email },
      {
        $set: {
          password: bcrypt.hashSync(password, 10),
        },
      }
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
        }
      );
      const updatedUser = await User.findById(userId).select(
        "-password -refreshToken"
      );
      res
        .status(StatusCode.Success)
        .json({
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
    const user = await User.findByIdAndDelete(userId);
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
      { new: true }
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
