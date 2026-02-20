import dotenv from "dotenv";
import { Category } from "../models/CategoryModel.js";
import { Course } from "../models/CourseModel.js";
import { connectDB } from "./index.js";
dotenv.config();

async function seedData() {
  await connectDB();
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
seedData()
  .then(() => {
    console.log("Seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
