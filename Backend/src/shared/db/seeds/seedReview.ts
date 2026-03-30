import mongoose from "mongoose";
import { RatingAndReview } from "../../../modules/rating/RatingAndReview.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/studynotion"; // adjust

// Existing user IDs from your courses data
const USERS = {
  mehul: new mongoose.Types.ObjectId("699bfb1fda0b668afc6b751d"),
  neha: new mongoose.Types.ObjectId("699bfb3ada0b668afc6b7525"),
  priya: new mongoose.Types.ObjectId("699bfb0dda0b668afc6b7515"),
  harmany: new mongoose.Types.ObjectId("69c95fee39aff5471ffc26fb"),
};

// Existing course IDs from your courses data
const COURSES = {
  advancedNode: new mongoose.Types.ObjectId("699d4aac3afda61bfe334ec3"),
  typescript: new mongoose.Types.ObjectId("699d4ad43afda61bfe334ecb"),
  webDev: new mongoose.Types.ObjectId("69c3a5205b2f3dcdfcd16bf0"),
  reactAdvanced: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9564"),
  nodeBackend: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9565"),
  jsBasics: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9566"),
  mongodb: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9567"),
  devops: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9568"),
  angular21a: new mongoose.Types.ObjectId("69c961d239aff5471ffc270c"),
  angular21b: new mongoose.Types.ObjectId("69c9646939aff5471ffc2754"),
  python: new mongoose.Types.ObjectId("69c97cf739aff5471ffc299d"),
};

const reviewSeeds = [
  // Advanced NodeJS Architecture
  {
    userId: USERS.priya,
    courseId: COURSES.advancedNode,
    rating: 5,
    review:
      "Absolutely brilliant course! The microservices section alone was worth it. Neha explains complex architecture patterns in a very digestible way.",
    isActive: true,
  },
  {
    userId: USERS.harmany,
    courseId: COURSES.advancedNode,
    rating: 4,
    review:
      "Great depth on queue-based systems and scaling. Would love more real-world deployment examples, but overall a solid advanced course.",
    isActive: true,
  },

  // TypeScript Essentials
  {
    userId: USERS.mehul,
    courseId: COURSES.typescript,
    rating: 5,
    review:
      "Finally a TypeScript course that focuses on real project usage rather than just syntax. Generics and utility types sections were excellent.",
    isActive: true,
  },
  {
    userId: USERS.priya,
    courseId: COURSES.typescript,
    rating: 4,
    review:
      "Very well structured for someone coming from plain JavaScript. The transition from JS to TS was explained smoothly.",
    isActive: true,
  },

  // Complete Web Development
  {
    userId: USERS.neha,
    courseId: COURSES.webDev,
    rating: 5,
    review:
      "This is the only web dev course you need. Covers everything from HTML basics to VPS deployment. Mehul's teaching style is top notch.",
    isActive: true,
  },
  {
    userId: USERS.harmany,
    courseId: COURSES.webDev,
    rating: 5,
    review:
      "The deployment section on custom VPS is something I haven't seen in any other course. Incredibly comprehensive and worth every minute.",
    isActive: true,
  },

  // React Advanced Concepts
  {
    userId: USERS.neha,
    courseId: COURSES.reactAdvanced,
    rating: 5,
    review:
      "The performance optimization chapter changed how I write React. useMemo and useCallback finally make sense. Highly recommended for mid-level devs.",
    isActive: true,
  },
  {
    userId: USERS.priya,
    courseId: COURSES.reactAdvanced,
    rating: 4,
    review:
      "Context API and custom hooks coverage was thorough. A section on Zustand or Jotai would make this perfect.",
    isActive: true,
  },

  // Node.js Backend Engineering
  {
    userId: USERS.mehul,
    courseId: COURSES.nodeBackend,
    rating: 5,
    review:
      "Best backend course I've taken. Auth flows, rate limiting, and scalability patterns are covered with production-level thinking.",
    isActive: true,
  },
  {
    userId: USERS.harmany,
    courseId: COURSES.nodeBackend,
    rating: 5,
    review:
      "The API design principles here are what I now use daily at work. Neha really understands what production systems look like.",
    isActive: true,
  },

  // JavaScript Basics
  {
    userId: USERS.mehul,
    courseId: COURSES.jsBasics,
    rating: 5,
    review:
      "Perfect starting point. Closures and scope were explained better here than in any other resource I've tried. Beginner-friendly without being dumbed down.",
    isActive: true,
  },
  {
    userId: USERS.neha,
    courseId: COURSES.jsBasics,
    rating: 4,
    review:
      "Great fundamentals course. The hands-on exercises after each concept really help cement the learning.",
    isActive: true,
  },

  // MongoDB Mastery
  {
    userId: USERS.neha,
    courseId: COURSES.mongodb,
    rating: 5,
    review:
      "The aggregation pipeline section is pure gold. I went from avoiding aggregations to confidently writing complex pipelines after this course.",
    isActive: true,
  },
  {
    userId: USERS.priya,
    courseId: COURSES.mongodb,
    rating: 4,
    review:
      "Indexing strategies and schema design chapters are production-ready knowledge. Saved me hours of debugging slow queries.",
    isActive: true,
  },

  // DevOps Crash Course
  {
    userId: USERS.mehul,
    courseId: COURSES.devops,
    rating: 5,
    review:
      "Went from zero Docker knowledge to setting up a full CI/CD pipeline in a week. The course is fast-paced but never overwhelming.",
    isActive: true,
  },
  {
    userId: USERS.priya,
    courseId: COURSES.devops,
    rating: 5,
    review:
      "The CI/CD section with GitHub Actions was exactly what my team needed. Practical, concise, and immediately applicable.",
    isActive: true,
  },

  // Angular 21 (first)
  {
    userId: USERS.mehul,
    courseId: COURSES.angular21a,
    rating: 4,
    review:
      "A refreshingly modern take on Angular. The component lifecycle and change detection explanations are the clearest I've seen.",
    isActive: true,
  },
  {
    userId: USERS.neha,
    courseId: COURSES.angular21a,
    rating: 4,
    review:
      "Solid intro to Angular 21. Routing and services section was particularly well done for beginners.",
    isActive: true,
  },

  // Angular 21 (second — with lectures)
  {
    userId: USERS.priya,
    courseId: COURSES.angular21b,
    rating: 5,
    review:
      "The hands-on project at the end tied everything together perfectly. Data binding and HTTP client usage felt natural after this.",
    isActive: true,
  },
  {
    userId: USERS.mehul,
    courseId: COURSES.angular21b,
    rating: 4,
    review:
      "Great structured learning path. Each lecture builds on the previous one in a logical way. Very beginner-friendly.",
    isActive: true,
  },

  // Python
  {
    userId: USERS.neha,
    courseId: COURSES.python,
    rating: 5,
    review:
      "The best Python intro I've recommended to my students. Data structures section with lists, tuples, and dicts is explained with perfect examples.",
    isActive: true,
  },
  {
    userId: USERS.mehul,
    courseId: COURSES.python,
    rating: 5,
    review:
      "Harmany has a gift for making programming feel approachable. File handling and functions chapters are especially well crafted.",
    isActive: true,
  },
];

async function seedReviews() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await RatingAndReview.deleteMany({});
    console.log("Cleared existing reviews");

    const inserted = await RatingAndReview.insertMany(reviewSeeds);
    console.log(`Seeded ${inserted.length} reviews successfully`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedReviews();
