import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();
async function run() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        const database = client.db("StudyNotion");
        const collection = database.collection("embeddings");
        const index = {
            name: "vector_index",
            definition: {
                mappings: {
                    dynamic: true,
                    fields: {
                        embedding: {
                            type: "knnVector",
                            dimensions: 768,
                            similarity: "dotProduct",
                        },
                    },
                },
            },
        };
        const result = await collection.createSearchIndex(index);
        console.log("Index created:", result);
    }
    finally {
        await client.close();
    }
}
run().catch(console.dir);
async function createEmbeddingCollection() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        const database = client.db("StudyNotion");
        const collection = database.collection("embeddings");
        const collections = await database.listCollections({ name: "embeddings" }).toArray();
        if (collections.length === 0) {
            await database.createCollection("embeddings");
            console.log("Collection 'embeddings' created.");
        }
        else {
            console.log("Collection 'embeddings' already exists.");
        }
    }
    finally {
        await client.close();
    }
}
//# sourceMappingURL=createVectorIndex.js.map