import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();
export const connectDB = async () => {
    const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();
    const db = mongoClient.db("studyNotion");
    const usersCollection = db.collection("users");
    const courseEnrollmentsCollection = db.collection("courseEnrollments");
    return { usersCollection, courseEnrollmentsCollection, mongoClient };
}