import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
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
    email: { type: String },
    refreshToken: { type: String },
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
          { _id: this._id, email: this.email },
          <string>process.env.JWT_ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        const refreshToken = jwt.sign(
          { _id: this._id, email: this.email },
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

const User = mongoose.model("User", userSchema);

export default User;
