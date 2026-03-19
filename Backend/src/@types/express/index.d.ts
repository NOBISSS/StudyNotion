import mongoose from "mongoose";
import { IUser } from "../../shared/types.ts";
import type { UserDocument } from "../../modules/user/UserModel.ts";
//Custom Request Objects:
declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
      expiry?: Date;
      user: UserDocument;
      accountType: "student" | "instructor" | "admin";
    }
  }
}
