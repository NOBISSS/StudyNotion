import { Types } from "mongoose";
import { UserStreak } from "../../modules/user/UserStreakModel.js";
export async function updateUserStreak(userId, hoursWatched = 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let streak = await UserStreak.findOne({ userId });
    if (!streak) {
        streak = new UserStreak({ userId });
    }
    const lastActive = streak.lastActiveDate
        ? new Date(streak.lastActiveDate.setHours(0, 0, 0, 0))
        : null;
    const alreadyActiveToday = lastActive?.getTime() === today.getTime();
    if (!alreadyActiveToday) {
        const wasActiveYesterday = lastActive?.getTime() === yesterday.getTime();
        streak.currentStreak = wasActiveYesterday ? streak.currentStreak + 1 : 1;
        streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
        streak.lastActiveDate = today;
        streak.activeDates.push(today);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        streak.activeDates = streak.activeDates.filter((d) => d >= ninetyDaysAgo);
    }
    const todayIndex = 6;
    streak.weeklyActivity[todayIndex] = parseFloat(((streak.weeklyActivity[todayIndex] || 0) + hoursWatched).toFixed(2));
    await streak.save();
    return streak;
}
//# sourceMappingURL=updateStreak.js.map