import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { StatusCode, type IUser } from "../types.js";
export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;
    const decodedToken = jwt.verify(
      accessToken,
      <string>process.env.JWT_ACCESS_TOKEN_SECRET
    ) as IUser;
    if (!decodedToken) {
      res.status(StatusCode.Unauthorized).json({ message: "Unautorized" });
      return;
    }
    const user = await User.findById(decodedToken._id).select("-password -refreshToken -__v");
    if (!user) {
      res.status(StatusCode.Unauthorized).json({ message: "Unauthorized" });
      return;
    }
    req.userId = user._id;
    req.user = user;
    req.accountType = user.accountType;
    next();
  } catch (err: any) {
    res
      .status(StatusCode.Unauthorized)
      .json({ message: err.message || "Something went wrong from our side" });
    return;
  }
};

export const isStudent = async (  
  req: Request,
  res: Response,
  next: NextFunction
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
    console.log(error);
    return res.status(StatusCode.Unauthorized).json({
      success: false,
      message: "Something went wrong from our side",
    });
  }
};

//INSTRUCTOR
export const isInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
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
    console.log(error);
    return res.status(StatusCode.Unauthorized).json({
      success: false,
      message: "Something went wrong from our side",
    });
  }
};

//ADMIN
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
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
    console.log(error);
    return res.status(StatusCode.Unauthorized).json({
      success: false,
      message: "Something went wrong from our side",
    });
  }
};
