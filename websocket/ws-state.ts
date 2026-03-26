// ws-state.ts  — shared between wsServer.ts and Express controllers
import { ObjectId } from "mongodb";
import WebSocket from "ws";

export interface ConnectedUser {
  ws: WebSocket;
  userId: string;
}

export const connectedUsers: ConnectedUser[] = [];

/**
 * Send an announcement to all users enrolled in a course.
 * Call this from any Express controller.
 */
export async function broadcastAnnouncement(
  courseId: string,
  instructorId: string,
  announcement: object,
  courseEnrollmentsCollection: any,
): Promise<void> {
  for (const user of connectedUsers) {
    // if (user.userId === instructorId) continue; // skip the instructor themselves

    const isEnrolled = await courseEnrollmentsCollection.findOne({
      userId: new ObjectId(user.userId),
      courseId: new ObjectId(courseId),
    });

    if (!isEnrolled) continue;

    if (user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(
        JSON.stringify({
          type: "announcement",
          courseId,
          data: announcement,
        }),
      );
    }
  }
}
