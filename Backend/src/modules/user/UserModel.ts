import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

export const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    password: { type: String },
    accountType: {
      type: String,
      enum: {
        values: ["student", "instructor", "admin"],
        message: "{VALUE} is not supported",
      },
      default: "student",
    },
    method: {
      type: String,
      enum: {
        values: ["local", "google","github"],
        message: "{VALUE} is not supported",
      },
      default: "local",
    },
    email: { type: String, required: true, trim: true },
    refreshToken: { type: String },
    isBanned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  {
    methods: {
      comparePassword(inputPassword: string) {
        return bcrypt.compareSync(inputPassword, this.password as string);
      },
      async hashPassword(inputPassword: string) {
        this.password = await bcrypt.hash(inputPassword, 10);
        return;
      },
      generateAccessAndRefreshToken() {
        const accessToken = jwt.sign(
          { _id: this._id, email: this.email, accountType: this.accountType },
          <string>process.env.JWT_ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" } 
        );
        const refreshToken = jwt.sign(
          { _id: this._id, email: this.email, accountType: this.accountType },
          <string>process.env.JWT_REFRESH_TOKEN_SECRET,
          { expiresIn: "15d" }
        );
        this.refreshToken = refreshToken;
        this.save();
        return { accessToken, refreshToken };
      },
    },
  }
);

UserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  }
);


export type IUser = InferSchemaType<typeof UserSchema>;
export type UserDocument = HydratedDocument<IUser>;

const User = mongoose.model("User", UserSchema);

export default User;
