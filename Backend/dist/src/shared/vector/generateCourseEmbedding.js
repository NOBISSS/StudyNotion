import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { Course } from "../../modules/course/CourseModel.js";
import { buildCourseEmbeddingText } from "../queue/embeddingQueue.js";
import { getEmbedding } from "./getEmbedding.js";
import { connectDB } from "../db/index.js";
dotenv.config();
export async function generateCourseEmbedding(course) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        const text = buildCourseEmbeddingText(course);
        const embedding = await getEmbedding(text);
        await client.connect();
        const db = client.db("StudyNotion");
        await db.collection("embeddings").updateOne({ courseId: course._id }, {
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
        }, { upsert: true });
    }
    finally {
        await client.close();
    }
}
async function generateEmbeddingsForExistingCourses() {
    await connectDB(process.env.MONGODB_URI);
    const courses = await Course.find({});
    console.log(`Generating embeddings for ${courses.length} courses...`);
    for (const course of courses) {
        await generateCourseEmbedding(course);
    }
}
//# sourceMappingURL=generateCourseEmbedding.js.map