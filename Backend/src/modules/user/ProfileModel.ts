import { model, Schema } from "mongoose";

const ProfileSchema = new Schema({
  about: { type: String, trim: true },
  contactNumber: { type: Number },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "other"],
      message: "{VALUE} is not supported",
    },
  },
  city: { type: String, trim: true },
  country: { type: String, trim: true },
  profilePicture: { type: String, trim: true },
  birthdate: { type: Date },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});
const Profile = model("Profile", ProfileSchema);

export { Profile };
