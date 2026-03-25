import dotenv from "dotenv";
import { Collection, Db, MongoClient } from "mongodb";
import WebSocket, { WebSocketServer } from "ws";
dotenv.config();
const PORT = (process.env.PORT as number | undefined) || 3002;

let db: Db;
let usersCollection: Collection;
let courseEnrollmentsCollection: Collection;

export const connectDB = async () => {
  const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
  await mongoClient.connect();
  db = mongoClient.db("studyNotion");
  usersCollection = db.collection("users");
  courseEnrollmentsCollection = db.collection("courseEnrollments");
};

interface User {
  ws: WebSocket;
  userId: string;
}

const users: User[] = [];
async function checkUser(
  userId: string,
  usersCollection: any,
): Promise<string | null> {
  try {
    const user = await usersCollection.findOne({ userId });
    return user ? user.userId : null;
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
}

// wss.on("connection", (ws, req) => {
//   console.log("Client connected");
//   ws.send("Hello from server");
// });

async function startServer() {
  await connectDB();
  const wss = new WebSocketServer({ port: PORT, host: "0.0.0.0" });
  wss.on("connection", async (ws, request) => {
    const url = request.url;
    if (!url) {
      return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const userId = queryParams.get("userId") || "";
    const user = await checkUser(userId, usersCollection);
    if (!user) {
      ws.close();
      return;
    }
    users.push({ ws, userId });
    ws.on("message", async (data: string) => {
      const parsedData = JSON.parse(data);
      console.log("Received message:", parsedData);
      if (parsedData.work == "announce") {
        const usersToNotify = users.filter((u) => u.userId !== userId);
        users.forEach((u) => {
          const isEnrolled = courseEnrollmentsCollection.findOne({
            userId: u.userId,
            courseId: parsedData.courseId,
          });
          if (!isEnrolled) {
            return;
          }
          u.ws.send(
            JSON.stringify({
              message: "Announcement from " + userId,
              data: parsedData,
            }),
          );
        });
      }
      ws.send(
        JSON.stringify({ message: "Message received", data: parsedData }),
      );
    });
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}
startServer().then(() => {
  console.log("WebSocket server listening on ws://localhost:" + PORT);
}).catch((err) => {
  console.error("Failed to start WebSocket server", err);
});