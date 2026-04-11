import { Schema, Types } from "mongoose";
export declare const UserStreak: import("mongoose").Model<{
    userId: Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    weeklyActivity: number[];
    activeDates: NativeDate[];
    lastActiveDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    userId: Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    weeklyActivity: number[];
    activeDates: NativeDate[];
    lastActiveDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    weeklyActivity: number[];
    activeDates: NativeDate[];
    lastActiveDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    weeklyActivity: number[];
    activeDates: NativeDate[];
    lastActiveDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    userId: Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    weeklyActivity: number[];
    activeDates: NativeDate[];
    lastActiveDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    userId: Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    weeklyActivity: number[];
    activeDates: NativeDate[];
    lastActiveDate?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    userId: Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    weeklyActivity: number[];
    activeDates: NativeDate[];
    lastActiveDate?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    userId: Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    weeklyActivity: number[];
    activeDates: NativeDate[];
    lastActiveDate?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=UserStreakModel.d.ts.map