import dotenv from "dotenv";
import mongoose from "mongoose";
import { Category } from "../../modules/category/CategoryModel.js";
import { Course } from "../../modules/course/CourseModel.js";
import { CourseEnrollment } from "../../modules/enrollment/CourseEnrollment.js";
import { connectDB } from "./index.js";
import User from "../../modules/user/UserModel.js";

dotenv.config();

async function seedData() {
  await connectDB(process.env.MONGODB_URI!);
  const courses = await Course.insertMany([
    {
      courseName: "Complete MERN Stack Development",
      instructorName: "Arafat Mansuri",
      description:
        "A practical, project-based course covering MongoDB, Express.js, React, and Node.js with real-world use cases.",
      instructorId: "69555b6aed5633e6e7cba60e",
      typeOfCourse: "Paid",
      originalPrice: 4999,
      discountPrice: 1999,
      thumbnailUrl: "https://example.com/thumbnails/mern-course.png",
      tag: ["MERN", "Full Stack", "Web Development"],
      slug: "complete-mern-stack-development2",
      categoryId: "69555c1aed5633e6e7cba61b",
      level: "Beginner-to-Advance",
      status: "Published",
      isBoosted: true,
    },
    {
      courseName: "JavaScript Fundamentals",
      instructorName: "Arafat Mansuri",
      description:
        "Learn core JavaScript concepts including variables, functions, loops, and basic DOM manipulation.",
      instructorId: "69555b6aed5633e6e7cba60e",
      typeOfCourse: "Free",
      originalPrice: 0,
      discountPrice: 0,
      thumbnailUrl: "https://example.com/thumbnails/js-fundamentals.png",
      tag: ["JavaScript", "Frontend", "Programming"],
      slug: "javascript-fundamentals",
      categoryId: "69555c1aed5633e6e7cba61b",
      level: "Beginner",
      status: "Published",
      isBoosted: false,
    },
    {
      courseName: "Node.js & Express Backend Mastery",
      instructorName: "Arafat Mansuri",
      description:
        "Build scalable backend applications using Node.js, Express, MongoDB, authentication, and best practices.",
      instructorId: "69555b6aed5633e6e7cba60e",
      typeOfCourse: "Paid",
      originalPrice: 3999,
      discountPrice: 1499,
      thumbnailUrl: "https://example.com/thumbnails/node-express.png",
      tag: ["Node.js", "Express", "Backend", "API"],
      slug: "nodejs-express-backend-mastery",
      categoryId: "69555c1aed5633e6e7cba61b",
      level: "Intermediate",
      status: "Published",
      isBoosted: true,
    },
    {
      courseName: "MongoDB for Developers",
      instructorName: "Arafat Mansuri",
      description:
        "Understand MongoDB deeply including schema design, aggregation pipeline, indexing, and performance optimization.",
      instructorId: "69555b6aed5633e6e7cba60e",
      typeOfCourse: "Paid",
      originalPrice: 2999,
      discountPrice: 999,
      thumbnailUrl: "https://example.com/thumbnails/mongodb-course.png",
      tag: ["MongoDB", "Database", "NoSQL"],
      slug: "mongodb-for-developers",
      categoryId: "69555c1aed5633e6e7cba61b",
      level: "Intermediate",
      status: "Draft",
      isBoosted: false,
    },
    {
      courseName: "React.js from Scratch",
      instructorName: "Arafat Mansuri",
      description:
        "Learn React from the ground up including hooks, state management, component design, and performance optimization.",
      instructorId: "69555b6aed5633e6e7cba60e",
      typeOfCourse: "Paid",
      originalPrice: 4499,
      discountPrice: 1799,
      thumbnailUrl: "https://example.com/thumbnails/react-course.png",
      tag: ["React", "Frontend", "SPA"],
      slug: "react-js-from-scratch",
      categoryId: "69555c1aed5633e6e7cba61b",
      level: "Beginner-to-Advance",
      status: "Published",
      isBoosted: true,
    },
    {
      courseName: "DevOps Basics for Web Developers",
      instructorName: "Arafat Mansuri",
      description:
        "Learn deployment, CI/CD pipelines, Docker, Nginx, and cloud basics tailored for web developers.",
      instructorId: "69555b6aed5633e6e7cba60e",
      typeOfCourse: "Paid",
      originalPrice: 3499,
      discountPrice: 1299,
      thumbnailUrl: "https://example.com/thumbnails/devops-course.png",
      tag: ["DevOps", "Docker", "CI/CD", "Deployment"],
      slug: "devops-basics-for-web-developers",
      categoryId: "69555c1aed5633e6e7cba61b",
      level: "Advance",
      status: "Draft",
      isBoosted: false,
    },
  ]);
  await Category.findByIdAndUpdate("69555c1aed5633e6e7cba61b", {
    $push: { courses: courses.map((course) => course._id) },
  });
}

export const seedCourseEnrollments = async () => {
  try {
    await connectDB(process.env.MONGODB_URI!);
    const enrollments = [
      {
        userId: new mongoose.Types.ObjectId("6953a3ba335df77c52c3df02"),
        courseId: new mongoose.Types.ObjectId("699d49eddbd93e88d301b55f"),
      },
      {
        userId: new mongoose.Types.ObjectId("6953a3f6335df77c52c3df11"),
        courseId: new mongoose.Types.ObjectId("699d49eddbd93e88d301b55f"),
      },
      {
        userId: new mongoose.Types.ObjectId("6956cb03b0918d3ff01c0d80"),
        courseId: new mongoose.Types.ObjectId("699d49eddbd93e88d301b55f"),
      },

      {
        userId: new mongoose.Types.ObjectId("69580d525b47687eb4a71957"),
        courseId: new mongoose.Types.ObjectId("699d4a803afda61bfe334ebc"),
      },
      {
        userId: new mongoose.Types.ObjectId("699bfaffda0b668afc6b7511"),
        courseId: new mongoose.Types.ObjectId("699d4a803afda61bfe334ebc"),
      },
      {
        userId: new mongoose.Types.ObjectId("699bfb15da0b668afc6b7519"),
        courseId: new mongoose.Types.ObjectId("699d4a803afda61bfe334ebc"),
      },

      {
        userId: new mongoose.Types.ObjectId("699bfb27da0b668afc6b7521"),
        courseId: new mongoose.Types.ObjectId("699d4aac3afda61bfe334ec3"),
      },
      {
        userId: new mongoose.Types.ObjectId("6953a3ba335df77c52c3df02"),
        courseId: new mongoose.Types.ObjectId("699d4aac3afda61bfe334ec3"),
      },
      {
        userId: new mongoose.Types.ObjectId("6953a3f6335df77c52c3df11"),
        courseId: new mongoose.Types.ObjectId("699d4aac3afda61bfe334ec3"),
      },

      {
        userId: new mongoose.Types.ObjectId("6956cb03b0918d3ff01c0d80"),
        courseId: new mongoose.Types.ObjectId("699d4ad43afda61bfe334ecb"),
      },
      {
        userId: new mongoose.Types.ObjectId("69580d525b47687eb4a71957"),
        courseId: new mongoose.Types.ObjectId("699d4ad43afda61bfe334ecb"),
      },
      {
        userId: new mongoose.Types.ObjectId("699bfaffda0b668afc6b7511"),
        courseId: new mongoose.Types.ObjectId("699d4ad43afda61bfe334ecb"),
      },

      {
        userId: new mongoose.Types.ObjectId("699bfb15da0b668afc6b7519"),
        courseId: new mongoose.Types.ObjectId("699d4ae93afda61bfe334ed2"),
      },
      {
        userId: new mongoose.Types.ObjectId("699bfb27da0b668afc6b7521"),
        courseId: new mongoose.Types.ObjectId("699d4ae93afda61bfe334ed2"),
      },
      {
        userId: new mongoose.Types.ObjectId("6953a3ba335df77c52c3df02"),
        courseId: new mongoose.Types.ObjectId("699d4ae93afda61bfe334ed2"),
      },

      {
        userId: new mongoose.Types.ObjectId("6953a3f6335df77c52c3df11"),
        courseId: new mongoose.Types.ObjectId("699d3c2b9a999b244781c5b1"),
      },
      {
        userId: new mongoose.Types.ObjectId("6956cb03b0918d3ff01c0d80"),
        courseId: new mongoose.Types.ObjectId("699d3c2b9a999b244781c5b1"),
      },
      {
        userId: new mongoose.Types.ObjectId("69580d525b47687eb4a71957"),
        courseId: new mongoose.Types.ObjectId("699d3c924e48f04f3d9938e1"),
      },
      {
        userId: new mongoose.Types.ObjectId("699bfaffda0b668afc6b7511"),
        courseId: new mongoose.Types.ObjectId("699d3c924e48f04f3d9938e1"),
      },
      {
        userId: new mongoose.Types.ObjectId("699bfb15da0b668afc6b7519"),
        courseId: new mongoose.Types.ObjectId("699d3c924e48f04f3d9938e1"),
      },
    ];

    await CourseEnrollment.insertMany(enrollments);
    console.log("✅ Course enrollments seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding enrollments:", error);
  }
};
export const updateCourseSlugs = async () => {
  try {
    await connectDB(process.env.MONGODB_URI!);
    const courses = await Course.find();
    for (const course of courses) {
      const instructor = await User
        .findById(course.instructorId);
      const newSlug = `${instructor?.firstName} ${instructor?.lastName}/${course.courseName}`;
      await Course.findByIdAndUpdate(course._id, { slug: newSlug });
    }
  } catch (error) {
    console.error("❌ Error updating course slugs:", error);
  }
};
updateCourseSlugs()
  .then(() => {
    console.log("Seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
