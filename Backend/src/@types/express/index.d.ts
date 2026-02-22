import mongoose from "mongoose";
import { IUser } from "../../types.ts";
//Custom Request Objects:
declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
      expiry?: Date;
      user: IUser;
      accountType: "student" | "instructor" | "admin";
    }
  }
}
