import { Queue } from "bullmq";
import type { Types } from "mongoose";
export interface SchedulePublishPayload {
    courseId: Types.ObjectId;
    instructorId: Types.ObjectId;
    courseName: string;
    scheduledAt: string;
}
export declare const scheduleQueue: Queue<SchedulePublishPayload, any, string, SchedulePublishPayload, any, string>;
export declare const schedulePublish: (payload: SchedulePublishPayload, publishAt: Date) => Promise<import("bullmq").Job<SchedulePublishPayload, any, string>>;
export declare const cancelScheduledPublish: (jobId: string) => Promise<void>;
export declare const reschedulePublish: (oldJobId: string | undefined, payload: SchedulePublishPayload, newPublishAt: Date) => Promise<import("bullmq").Job<SchedulePublishPayload, any, string>>;
//# sourceMappingURL=scheduleQueue.d.ts.map