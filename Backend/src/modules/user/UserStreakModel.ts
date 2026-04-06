// models/UserStreak.ts
import { model, Schema, Types } from "mongoose";

const UserStreakSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    // Store last 7 days activity in hours for the weekly chart
    weeklyActivity: {
      type: [Number],
      default: [0, 0, 0, 0, 0, 0, 0],
    },
    // Track which calendar dates were active for streak calculation
    activeDates: [{ type: Date }],
  },
  { timestamps: true },
);

export const UserStreak = model("UserStreak", UserStreakSchema);
