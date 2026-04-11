import { model, Schema, Types } from "mongoose";
const UserStreakSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    weeklyActivity: {
        type: [Number],
        default: [0, 0, 0, 0, 0, 0, 0],
    },
    activeDates: [{ type: Date }],
}, { timestamps: true });
export const UserStreak = model("UserStreak", UserStreakSchema);
//# sourceMappingURL=UserStreakModel.js.map