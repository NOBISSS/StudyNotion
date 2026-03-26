// wsServer.ts
import dotenv from "dotenv";
import http from "http";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import WebSocket, { WebSocketServer } from "ws";
import { connectedUsers, broadcastAnnouncement } from "./ws-state.js";

dotenv.config();

const WS_PORT = Number(process.env.WS_PORT) || 3001;
const INTERNAL_HTTP_PORT = Number(process.env.INTERNAL_HTTP_PORT) || 3002;
const INTERNAL_SECRET = process.env.INTERNAL_SECRET as string; // shared secret between both servers

let db: Db;
let usersCollection: Collection;
export let courseEnrollmentsCollection: Collection;
let mongoClient: MongoClient;

export const connectDB = async (): Promise<void> => {
  if (mongoClient) return;
  mongoClient = new MongoClient(process.env.MONGODB_URI as string, {
    maxPoolSize: 10,
  });
  await mongoClient.connect();
  db = mongoClient.db("StudyNotion");
  usersCollection = db.collection("users");
  courseEnrollmentsCollection = db.collection("courseenrollments");
  console.log("Connected to MongoDB");
};

async function checkUser(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    let user = null;
    if (ObjectId.isValid(userId)) {
      user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    }
    if (!user) {
      user = await usersCollection.findOne({ userId });
    }
    return user !== null;
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
}

// Internal HTTP server — only called by your Express server, never exposed publicly
function startInternalHttpServer() {
  const server = http.createServer(async (req, res) => {
    if (req.method !== "POST" || req.url !== "/announce") {
      res.writeHead(404).end();
      return;
    }

    // Verify shared secret so only your Express server can call this
    const secret = req.headers["x-internal-secret"];
    if (secret !== INTERNAL_SECRET) {
      res.writeHead(401).end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { courseId, instructorId, announcement } = JSON.parse(body);

        if (!courseId || !instructorId || !announcement) {
          res.writeHead(400).end(JSON.stringify({ error: "Missing fields" }));
          return;
        }

        await broadcastAnnouncement(
          courseId,
          instructorId,
          announcement,
          courseEnrollmentsCollection,
        );

        res.writeHead(200).end(JSON.stringify({ ok: true }));
      } catch (err) {
        console.error("Internal HTTP error:", err);
        res.writeHead(500).end(JSON.stringify({ error: "Internal error" }));
      }
    });
  });

  server.listen(INTERNAL_HTTP_PORT, "127.0.0.1", () => {
    console.log(`Internal HTTP server on 127.0.0.1:${INTERNAL_HTTP_PORT}`);
  });
}

async function startServer(): Promise<void> {
  await connectDB();

  const wss = new WebSocketServer({ port: WS_PORT, host: "0.0.0.0" });

  wss.on("connection", async (ws: WebSocket, request) => {
    const url = request.url;
    if (!url) {
      ws.close(1008, "Missing URL");
      return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1] ?? "");
    const userId = queryParams.get("userId") ?? "";

    if (!userId) {
      ws.close(1008, "userId is required");
      return;
    }

    const isValid = await checkUser(userId);
    if (!isValid) {
      console.log("Unauthorized connection attempt:", userId);
      ws.close(1008, "Unauthorized");
      return;
    }

    console.log("Client connected:", userId);
    connectedUsers.push({ ws, userId });

    ws.on("message", async (data: WebSocket.RawData) => {
      let parsedData: any;
      try {
        parsedData = JSON.parse(data.toString());
      } catch {
        ws.send(JSON.stringify({ error: "Invalid JSON" }));
        return;
      }
      ws.send(
        JSON.stringify({ message: "Message received", data: parsedData }),
      );
    });

    ws.on("close", () => {
      console.log("Client disconnected:", userId);
      const index = connectedUsers.findIndex(
        (u) => u.userId === userId && u.ws === ws,
      );
      if (index !== -1) connectedUsers.splice(index, 1);
    });

    ws.on("error", (err) => {
      console.error("WebSocket error for", userId, ":", err.message);
    });
  });

  startInternalHttpServer();

  console.log(`WebSocket server on ws://0.0.0.0:${WS_PORT}`);
}

startServer().catch((err) => {
  console.error("Failed to start WebSocket server:", err);
  process.exit(1);
});
