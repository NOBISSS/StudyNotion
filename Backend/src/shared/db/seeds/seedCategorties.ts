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
        name: "Uncategorized",
        description:"Default category for courses without a specific category.",
        isActive: true,
        courses: [], // optional, can be populated later
      },
    ];
    // const categories = [
    //   {
    //     name: "Web Development",
    //     description:
    //       "Courses related to frontend, backend, and full stack web development.",
    //     isActive: true,
    //     courses: [], // optional, can be populated later
    //   },

    //   {
    //     name: "Frontend Development",
    //     description:
    //       "Learn UI development with React, HTML, CSS, and modern frontend tools.",
    //     isActive: true,
    //     courses: [],
    //   },

    //   {
    //     name: "Backend Development",
    //     description:
    //       "Build scalable server-side applications using Node.js, APIs, and databases.",
    //     isActive: true,
    //     courses: [],
    //   },

    //   {
    //     name: "Database Management",
    //     description:
    //       "Understand SQL, NoSQL, database design, and performance optimization.",
    //     isActive: true,
    //     courses: [],
    //   },

    //   {
    //     name: "DevOps & Cloud",
    //     description:
    //       "Learn deployment, CI/CD, Docker, Kubernetes, and cloud computing.",
    //     isActive: true,
    //     courses: [],
    //   },

    //   {
    //     name: "Programming Languages",
    //     description:
    //       "Core programming concepts using JavaScript, Python, and other languages.",
    //     isActive: true,
    //     courses: [],
    //   },

    //   {
    //     name: "Mobile Development",
    //     description:
    //       "Build mobile apps using React Native, Flutter, and native technologies.",
    //     isActive: true,
    //     courses: [],
    //   },

    //   {
    //     name: "Data Structures & Algorithms",
    //     description:
    //       "Master problem solving, DSA, and coding interview preparation.",
    //     isActive: true,
    //     courses: [],
    //   },
    // ];

    await Category.insertMany(categories);

    console.log("✅ Categories seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
};
export const attachCoursesToCategories = async () => {
  try {
    await connectDB(process.env.MONGODB_URI!);
    // Fullstack
    await Category.findByIdAndUpdate("69555c1aed5633e6e7cba61b", {
      $addToSet: {
        courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9563"),
      },
    });

    // Frontend
    await Category.findByIdAndUpdate("69c505811dec52581649e6d1", {
      $addToSet: {
        courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9564"),
      },
    });

    // Backend
    await Category.findByIdAndUpdate("69c505811dec52581649e6d2", {
      $addToSet: {
        courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9565"),
      },
    });

    // Programming
    await Category.findByIdAndUpdate("69c505811dec52581649e6d5", {
      $addToSet: {
        courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9566"),
      },
    });

    // Database
    await Category.findByIdAndUpdate("69c505811dec52581649e6d3", {
      $addToSet: {
        courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9567"),
      },
    });

    // DevOps
    await Category.findByIdAndUpdate("69c505811dec52581649e6d4", {
      $addToSet: {
        courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9568"),
      },
    });

    console.log("✅ Courses correctly attached to categories");
  } catch (error) {
    console.error("❌ Error attaching courses:", error);
  }
};
seedCategories()
  .then(() => {
    console.log("courses attached to categories successfully");
  })
  .catch((error) => console.log("error", error));
