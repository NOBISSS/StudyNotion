import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  try {
    const database = client.db("StudyNotion");
    const collection = database.collection("embeddings");

    // ✅ Correct Vector Index Definition
    const index = {
      name: "vector_index",
      definition: {
        mappings: {
          dynamic: true,
          fields: {
            embedding: {
              type: "knnVector",
              dimensions: 768,
              similarity: "dotProduct", // or "cosine"
            },
          },
        },
      },
    };

    // 🛠️ Create the search index
    const result = await collection.createSearchIndex(index);
    console.log("Index created:", result);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
async function createEmbeddingCollection() {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    try {
        const database = client.db("StudyNotion");
        const collection = database.collection("embeddings");
        // Check if the collection already exists
        const collections = await database.listCollections({ name: "embeddings" }).toArray();
        if (collections.length === 0) {
            await database.createCollection("embeddings");
            console.log("Collection 'embeddings' created.");
        } else {
            console.log("Collection 'embeddings' already exists.");
        }
    } finally {        await client.close();
    }
}
// createEmbeddingCollection().catch(console.dir);