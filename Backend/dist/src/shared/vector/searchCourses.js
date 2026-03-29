import { MongoClient } from "mongodb";
import { getEmbedding } from "./getEmbedding.js";
import dotenv from "dotenv";
dotenv.config();
export async function vectorSearchCourses(queryText) {
    const queryEmbedding = await getEmbedding(queryText);
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const results = await client
        .db("StudyNotion")
        .collection("embeddings")
        .aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: 10,
            },
        },
        {
            $project: {
                courseId: 1,
                courseName: 1,
                slug: 1,
                score: { $meta: "vectorSearchScore" },
            },
        },
    ])
        .toArray();
    return results;
}
//# sourceMappingURL=searchCourses.js.map