import mongoose from "mongoose";
import { User } from "../../types.ts";
//Custom Request Objects:
declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
      expiry?: Date;
      user: User;
    }
  }
}
