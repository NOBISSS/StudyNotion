import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

async function debugDB() {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  const db = client.db("StudyNotion");

  // 1. Print first 3 documents in users collection — shows exact field names
  console.log("=== Sample user documents ===");
  const users = await db
    .collection("courseenrollments")
    .find({ courseId: new ObjectId("69c3a5205b2f3dcdfcd16bf0") })
    .limit(3)
    .toArray();
  console.log(JSON.stringify(users, null, 2));

  // 2. Print all field keys from the first user
  if (users.length > 0) {
    console.log("\n=== Field names in user document ===");
    // @ts-ignore
    console.log(Object.keys(users[0]));
  }

  await client.close();
}

debugDB().catch(console.error);
