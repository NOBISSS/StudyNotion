import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import User, { type UserDocument } from "../../modules/user/UserModel.js";
import { StatusCode } from "../types.js";
export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;
    const decodedToken = jwt.verify(
      accessToken,
      <string>process.env.JWT_ACCESS_TOKEN_SECRET,
    ) as UserDocument;
    if (!decodedToken) {
      res.status(StatusCode.Unauthorized).json({ message: "Unautorized" });
      return;
    }
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken -__v",
    );
    if (!user) {
      res.status(StatusCode.Unauthorized).json({ message: "Unauthorized" });
      return;
    }
    req.userId = user._id;
    req.user = user;
    req.accountType = user.accountType;
    next();
  } catch (err) {
    res
      .status(StatusCode.Unauthorized)
      .json({ message: "Something went wrong from our side", error: err });
    return;
  }
};

export const isStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.accountType == "admin") {
      next();
      return;
    }
    if (req.accountType !== "student") {
      return res.status(StatusCode.Unauthorized).json({
        success: false,
        message: "Only students are allowed to access this route",
      });
    }
    next();
  } catch (error) {
    return res.status(StatusCode.Unauthorized).json({
      success: false,
      message: "Something went wrong from our side",
      error: error,
    });
  }
};

//INSTRUCTOR
export const isInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.accountType == "admin" || req.accountType == "instructor") {
      next();
      return;
    }
    if (req.accountType == "student") {
      res.status(StatusCode.Unauthorized).json({
        success: false,
        message: "Only instructors are allowed to access this route",
      });
      return;
    }
    next();
    return;
  } catch (error) {
    return res.status(StatusCode.Unauthorized).json({
      success: false,
      message: "Something went wrong from our side",
      error: error,
    });
  }
};

//ADMIN
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.accountType !== "admin") {
      return res.status(StatusCode.Unauthorized).json({
        success: false,
        message: "Only admins are allowed to access this route",
      });
    }
    next();
  } catch (error) {
    return res.status(StatusCode.Unauthorized).json({
      success: false,
      message: "Something went wrong from our side",
      error: error,
    });
  }
};
