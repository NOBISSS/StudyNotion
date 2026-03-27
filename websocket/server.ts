import dotenv from "dotenv";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import WebSocket, { WebSocketServer } from "ws";

dotenv.config();

const PORT = Number(process.env.PORT) || 3002;

let db: Db;
let usersCollection: Collection;
let courseEnrollmentsCollection: Collection;

// Single MongoClient instance — reused across all connections
let mongoClient: MongoClient;

export const connectDB = async (): Promise<void> => {
  if (mongoClient) return; // prevent multiple connections
  mongoClient = new MongoClient(process.env.MONGODB_URI as string, {
    maxPoolSize: 10, // connection pooling to avoid topology errors
  });
  await mongoClient.connect();
  db = mongoClient.db("StudyNotion");
  usersCollection = db.collection("users");
  courseEnrollmentsCollection = db.collection("courseenrollments");
  console.log("Connected to MongoDB");
};

interface ConnectedUser {
  ws: WebSocket;
  userId: string;
}

const connectedUsers: ConnectedUser[] = [];

async function checkUser(userId: string): Promise<boolean> {
  if (!userId) return false;

  try {
    let user = null;

    // Case 1: userId is a valid MongoDB ObjectId string
    if (ObjectId.isValid(userId)) {
      user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    }

    // Case 2: fallback — userId is stored as a plain string field
    if (!user) {
      user = await usersCollection.findOne({ userId });
    }

    return user !== null;
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
}

async function startServer(): Promise<void> {
  await connectDB();

  const wss = new WebSocketServer({ port: PORT, host: "0.0.0.0" });

  wss.on("connection", async (ws: WebSocket, request) => {
    const url = request.url;
    if (!url) {
      ws.close(1008, "Missing URL");
      return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1] ?? "");
    const userId = queryParams.get("userId") ?? "";

    if (!userId) {
      console.log("Connection rejected: no userId provided");
      ws.close(1008, "userId is required");
      return;
    }

    const isValid = await checkUser(userId);
    if (!isValid) {
      ws.close(1008, "Unauthorized");
      return;
    }
    connectedUsers.push({ ws, userId });

    ws.on("message", async (data: WebSocket.RawData) => {
      let parsedData: any;

      try {
        parsedData = JSON.parse(data.toString());
      } catch {
        ws.send(JSON.stringify({ error: "Invalid JSON" }));
        return;
      }

      if (parsedData.work === "announce") {
        const { courseId } = parsedData;

        if (!courseId) {
          ws.send(
            JSON.stringify({ error: "courseId is required for announce" }),
          );
          return;
        }
        for (const connectedUser of connectedUsers) {
          if (connectedUser.userId === userId) continue;

          const isEnrolled = await courseEnrollmentsCollection.findOne({
            userId: new ObjectId(connectedUser.userId),
            courseId: new ObjectId(courseId),
          });

          if (!isEnrolled) continue;

          if (connectedUser.ws.readyState === WebSocket.OPEN) {
            connectedUser.ws.send(
              JSON.stringify({
                message: "Announcement from " + userId,
                data: parsedData,
              }),
            );
          }
        }
      }

      ws.send(
        JSON.stringify({ message: "Message received", data: parsedData }),
      );
    });

    ws.on("close", () => {
      console.log("Client disconnected:", userId);
      // Clean up disconnected user from the list
      const index = connectedUsers.findIndex(
        (u) => u.userId === userId && u.ws === ws,
      );
      if (index !== -1) {
        connectedUsers.splice(index, 1);
      }
    });

    ws.on("error", (err) => {
      console.error("WebSocket error for user", userId, ":", err.message);
    });
  });

  console.log(`WebSocket server listening on ws://0.0.0.0:${PORT}`);
}

startServer().catch((err) => {
  console.error("Failed to start WebSocket server:", err);
  process.exit(1);
});
