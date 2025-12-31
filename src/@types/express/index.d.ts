import mongoose, { Document } from "mongoose";
//Custom Request Objects:
declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
      expiry?: Date;
      user: typeof Document & User;
    }
  }
}
