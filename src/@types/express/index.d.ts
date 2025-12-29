import mongoose from "mongoose";
import { z } from "zod";
import { ITags } from "../../types";
//Custom Request Objects:
declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
      expiry?: Date;
    }
  }
}
