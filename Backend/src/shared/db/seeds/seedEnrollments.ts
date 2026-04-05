import dotenv from "dotenv";
import mongoose from "mongoose";
import { Course } from "../../../modules/course/CourseModel.js";
import { CourseEnrollment } from "../../../modules/enrollment/CourseEnrollment.js";
dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/studynotion"; // adjust

async function updateEnrollments() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const courseEnrollments = await CourseEnrollment.find();
    for (const enrollment of courseEnrollments) {
      await CourseEnrollment.updateMany(
        { _id: enrollment._id },
        { $set: { enrolledAt: enrollment.createdAt } },
      );
    }
    // const courses = await Course.find();
    // for (const course of courses) {
    //   await CourseEnrollment.updateMany(
    //     { courseId: course._id },
    //     { $set: { instructorId: course.instructorId } },
    //   );
    // }
    // const courses = await Course.find();
    // for (const course of courses) {
    //   await CourseEnrollment.updateMany(
    //     { courseId: course._id },
    //     { $set: { amountPaid: course.originalPrice } },
    //   );
    // }
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}
async function addEnrollments() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const courseEnrollments = await CourseEnrollment.create({
      userId: new mongoose.Types.ObjectId("69ca1f6a5135fb97c59c0aea"),
      courseId: new mongoose.Types.ObjectId("69c961d239aff5471ffc270c"),
      enrolledAt: new Date(),
      amountPaid: 0,
      instructorId: new mongoose.Types.ObjectId("69ca267d0a63bde4a91ca3ae"),
    });
    
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

addEnrollments().then(()=> console.log("Enrollment seeding completed"));