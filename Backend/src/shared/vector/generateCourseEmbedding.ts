import { MongoClient } from "mongodb";
import { buildCourseEmbeddingText } from "../queue/embeddingQueue.js";
import { getEmbedding } from "./getEmbedding.js";
import dotenv from "dotenv";
dotenv.config();

export async function generateCourseEmbedding(course: any) {
    const client = new MongoClient(process.env.MONGODB_URI!);

    try {
      const text = buildCourseEmbeddingText(course);
      const embedding = await getEmbedding(text);

      await client.connect();
      const db = client.db("StudyNotion");

      await db.collection("embeddings").updateOne(
        { courseId: course._id },
        {
          $set: {
            courseId: course._id,
            embedding,
            courseName: course.courseName,
            slug: course.slug,
            level: course.level,
            typeOfCourse: course.typeOfCourse,
            categoryId: course.categoryId,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      );
    } finally {
      await client.close();
    }
}