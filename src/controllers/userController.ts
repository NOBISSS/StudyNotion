import bcrypt from "bcrypt";
import { type CookieOptions, type Request, type Response } from "express";
import otpGenerator from "otp-generator";
import { z } from "zod";
import { OTP } from "../models/OTPModel.js";
import User from "../models/UserModel.js";
import { type Handler, StatusCode } from "../types.js";

const userInputSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be atleast 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be atleast 3 characters" }),
  accountType: z.string(),
  email: z.email({ message: "Invalid email address" }),
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
