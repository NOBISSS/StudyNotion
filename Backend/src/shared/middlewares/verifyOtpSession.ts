import type { Request, Response, NextFunction } from "express";
import { StatusCode } from "../types.js";

export const verifyOtpSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const otpData = req.cookies?.otp_data;

  if (!otpData || !otpData.email || !otpData.type) {
    return res.status(StatusCode.Unauthorized).json({
      message: "OTP session expired or invalid",
    });
  }

  next();
};
