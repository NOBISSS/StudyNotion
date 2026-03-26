import mongoose from "mongoose";
import { Category } from "../../../modules/category/CategoryModel.js";
import { connectDB } from "../index.js";
import dotenv from "dotenv";
dotenv.config();

export const seedCategories = async () => {
  await connectDB(process.env.MONGODB_URI!);
  try {
    const categories = [
      {
        name: "Web Development",
        description:
          "Courses related to frontend, backend, and full stack web development.",
        isActive: true,
        courses: [], // optional, can be populated later
      },

      {
        name: "Frontend Development",
        description:
          "Learn UI development with React, HTML, CSS, and modern frontend tools.",
        isActive: true,
        courses: [],
      },

      {
        name: "Backend Development",
        description:
          "Build scalable server-side applications using Node.js, APIs, and databases.",
        isActive: true,
        courses: [],
      },

      {
        name: "Database Management",
        description:
          "Understand SQL, NoSQL, database design, and performance optimization.",
        isActive: true,
        courses: [],
      },

      {
        name: "DevOps & Cloud",
        description:
          "Learn deployment, CI/CD, Docker, Kubernetes, and cloud computing.",
        isActive: true,
        courses: [],
      },

      {
        name: "Programming Languages",
        description:
          "Core programming concepts using JavaScript, Python, and other languages.",
        isActive: true,
        courses: [],
      },

      {
        name: "Mobile Development",
        description:
          "Build mobile apps using React Native, Flutter, and native technologies.",
        isActive: true,
        courses: [],
      },

      {
        name: "Data Structures & Algorithms",
        description:
          "Master problem solving, DSA, and coding interview preparation.",
        isActive: true,
        courses: [],
      },
    ];

    await Category.insertMany(categories);

    console.log("✅ Categories seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
};
seedCategories()
  .then(() => {
    console.log("categories seeded successfully");
  })
  .catch((error) => console.log("error", error));
