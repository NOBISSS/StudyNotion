import { Types } from "mongoose";
export declare function updateUserStreak(userId: Types.ObjectId, hoursWatched?: number): Promise<import("mongoose").Document<unknown, {}, {
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
}>;
//# sourceMappingURL=updateStreak.d.ts.map