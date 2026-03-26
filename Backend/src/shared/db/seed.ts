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
    try {
      const courses = [
        {
          courseName: "Complete MERN Stack Bootcamp",
          instructorName: "Priya Desai",
          instructorId: new mongoose.Types.ObjectId("699bfb0dda0b668afc6b7515"),
          description:
            "Master full stack development using MongoDB, Express, React and Node.js with real-world projects.",
          typeOfCourse: "Paid",
          originalPrice: 4999,
          discountPrice: 1999,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
          whatYouWillLearn: ["REST APIs", "React", "MongoDB", "JWT"],
          tag: ["mern", "fullstack"],
          slug: "complete-mern-stack-bootcamp-v4",
          categoryId: new mongoose.Types.ObjectId("69555c1aed5633e6e7cba61b"), // Fullstack
          level: "Beginner-to-Advance",
          status: "Published",
          isBoosted: true,
        },

        {
          courseName: "React Advanced Concepts",
          instructorName: "Mehul Joshi",
          instructorId: new mongoose.Types.ObjectId("699bfb1fda0b668afc6b751d"),
          description:
            "Learn advanced React including hooks, performance, and architecture.",
          typeOfCourse: "Paid",
          originalPrice: 2999,
          discountPrice: 1299,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
          whatYouWillLearn: ["Hooks", "Context API", "Optimization"],
          tag: ["react", "frontend"],
          slug: "react-advanced-concepts-v3",
          categoryId: new mongoose.Types.ObjectId("69c505811dec52581649e6d1"), // Frontend
          level: "Intermediate",
          status: "Published",
        },

        {
          courseName: "Node.js Backend Engineering",
          instructorName: "Neha Patel",
          instructorId: new mongoose.Types.ObjectId("699bfb3ada0b668afc6b7525"),
          description:
            "Build scalable backend systems with Node.js and Express.",
          typeOfCourse: "Paid",
          originalPrice: 3999,
          discountPrice: 1799,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
          whatYouWillLearn: ["APIs", "Auth", "Scalability"],
          tag: ["nodejs", "backend"],
          slug: "nodejs-backend-engineering-v3",
          categoryId: new mongoose.Types.ObjectId("69c505811dec52581649e6d2"), // Backend
          level: "Advance",
          status: "Published",
          isBoosted: true,
        },

        {
          courseName: "JavaScript Basics",
          instructorName: "Priya Desai",
          instructorId: new mongoose.Types.ObjectId("699bfb0dda0b668afc6b7515"),
          description: "Start coding with JavaScript fundamentals.",
          typeOfCourse: "Free",
          originalPrice: 0,
          discountPrice: 0,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1518770660439-4636190af475",
          whatYouWillLearn: ["Variables", "Loops", "Functions"],
          tag: ["javascript"],
          slug: "javascript-basics-v3",
          categoryId: new mongoose.Types.ObjectId("69c505811dec52581649e6d5"), // Programming
          level: "Beginner",
          status: "Published",
        },

        {
          courseName: "MongoDB Mastery",
          instructorName: "Mehul Joshi",
          instructorId: new mongoose.Types.ObjectId("699bfb1fda0b668afc6b751d"),
          description:
            "Advanced MongoDB concepts including aggregation and indexing.",
          typeOfCourse: "Paid",
          originalPrice: 2499,
          discountPrice: 999,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1542831371-d531d36971e6",
          whatYouWillLearn: ["Aggregation", "Indexes", "Schema"],
          tag: ["mongodb", "database"],
          slug: "mongodb-mastery-v3",
          categoryId: new mongoose.Types.ObjectId("69c505811dec52581649e6d3"), // Database
          level: "Intermediate",
          status: "Draft",
        },

        {
          courseName: "DevOps Crash Course",
          instructorName: "Neha Patel",
          instructorId: new mongoose.Types.ObjectId("699bfb3ada0b668afc6b7525"),
          description: "Learn Docker, CI/CD, and deployment strategies.",
          typeOfCourse: "Paid",
          originalPrice: 3499,
          discountPrice: 1499,
          thumbnailUrl:
            "https://images.unsplash.com/photo-1607743386760-88ac62b89b8a",
          whatYouWillLearn: ["Docker", "CI/CD", "Deployment"],
          tag: ["devops"],
          slug: "devops-crash-course-v3",
          categoryId: new mongoose.Types.ObjectId("69c505811dec52581649e6d4"), // DevOps
          level: "Advance",
          status: "Published",
          isBoosted: true,
        },
      ];

      const createdCourses = await Course.insertMany(courses);

      // await Category.findByIdAndUpdate(categoryId, {
      //   $push: {
      //     courses: { $each: createdCourses.map((c) => c._id) },
      //   },
      // });
      console.log("✅ Courses seeded successfully");
    } catch (error) {
      console.error("❌ Error seeding courses:", error);
    }
}
async function unseedData() {
  await connectDB(process.env.MONGODB_URI!);
  await Course.deleteMany({
    _id: {
      $in: [
        "69c506848b3277d5c9bf78c8",
        "69c506848b3277d5c9bf78c9",
        "69c506848b3277d5c9bf78ca",
        "69c506848b3277d5c9bf78cb",
        "69c506848b3277d5c9bf78cc",
        "69c506848b3277d5c9bf78cd",
      ].map((id) => new mongoose.Types.ObjectId(id)),
    },
  });
  await Category.updateMany(
  {},
  { $pull: { courses: { $in: [
    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78c8"),
    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78c9"),
    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78ca"),
    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78cb"),
    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78cc"),
    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78cd")
  ] } } }
);
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
seedData()
  .then(() => {
    console.log("Unseeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
