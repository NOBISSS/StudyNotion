import dotenv from "dotenv";
import mongoose from "mongoose";
import { Category } from "../../modules/category/CategoryModel.js";
import { Course } from "../../modules/course/CourseModel.js";
import { CourseEnrollment } from "../../modules/enrollment/CourseEnrollment.js";
import { Section } from "../../modules/section/SectionModel.js";
import User from "../../modules/user/UserModel.js";
import { connectDB } from "./index.js";
dotenv.config();
const sampleGithubOAuthResponse = {
    login: "arafatmansuri",
    id: 175376100,
    node_id: "U_kgDOCnQG5A",
    avatar_url: "https://avatars.githubusercontent.com/u/175376100?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/arafatmansuri",
    html_url: "https://github.com/arafatmansuri",
    followers_url: "https://api.github.com/users/arafatmansuri/followers",
    following_url: "https://api.github.com/users/arafatmansuri/following{/other_user}",
    gists_url: "https://api.github.com/users/arafatmansuri/gists{/gist_id}",
    starred_url: "https://api.github.com/users/arafatmansuri/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/arafatmansuri/subscriptions",
    organizations_url: "https://api.github.com/users/arafatmansuri/orgs",
    repos_url: "https://api.github.com/users/arafatmansuri/repos",
    events_url: "https://api.github.com/users/arafatmansuri/events{/privacy}",
    received_events_url: "https://api.github.com/users/arafatmansuri/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
    name: "Mansuripinjara Mohammedarafat Yasinbhai",
    company: "NA",
    blog: "https://mohammedarafat.me",
    location: "Ahmedabad, Gujarat, India",
    email: "mansuriarafat302@gmail.com",
    hireable: true,
    bio: "Fullstack developer",
    twitter_username: "_MohammedArafat",
    notification_email: "mansuriarafat302@gmail.com",
    public_repos: 22,
    public_gists: 0,
    followers: 4,
    following: 15,
    created_at: "2024-07-12T03:34:48Z",
    updated_at: "2026-03-07T15:23:16Z",
};
const sampleGoogleOAuthResponse = {
    data: {
        id: "100612055580398392690",
        email: "mansuriarafat302@gmail.com",
        verified_email: true,
        name: "Arafat Mansuri",
        given_name: "Arafat",
        family_name: "Mansuri",
        picture: "https://lh3.googleusercontent.com/a/ACg8ocJrM6TzMclHa2mnjSgqcxvMpGVyYCKQ9_UUxJruMNLmiUVZcI3k=s96-c",
    },
};
async function seedData() {
    await connectDB(process.env.MONGODB_URI);
    try {
        const courses = [
            {
                courseName: "Complete MERN Stack Bootcamp",
                instructorName: "Priya Desai",
                instructorId: new mongoose.Types.ObjectId("699bfb0dda0b668afc6b7515"),
                description: "Master full stack development using MongoDB, Express, React and Node.js with real-world projects.",
                typeOfCourse: "Paid",
                originalPrice: 4999,
                discountPrice: 1999,
                thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
                whatYouWillLearn: ["REST APIs", "React", "MongoDB", "JWT"],
                tag: ["mern", "fullstack"],
                slug: "complete-mern-stack-bootcamp-v4",
                categoryId: new mongoose.Types.ObjectId("69555c1aed5633e6e7cba61b"),
                level: "Beginner-to-Advance",
                status: "Published",
                isBoosted: true,
            },
            {
                courseName: "React Advanced Concepts",
                instructorName: "Mehul Joshi",
                instructorId: new mongoose.Types.ObjectId("699bfb1fda0b668afc6b751d"),
                description: "Learn advanced React including hooks, performance, and architecture.",
                typeOfCourse: "Paid",
                originalPrice: 2999,
                discountPrice: 1299,
                thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
                whatYouWillLearn: ["Hooks", "Context API", "Optimization"],
                tag: ["react", "frontend"],
                slug: "react-advanced-concepts-v3",
                categoryId: new mongoose.Types.ObjectId("69c505811dec52581649e6d1"),
                level: "Intermediate",
                status: "Published",
            },
            {
                courseName: "Node.js Backend Engineering",
                instructorName: "Neha Patel",
                instructorId: new mongoose.Types.ObjectId("699bfb3ada0b668afc6b7525"),
                description: "Build scalable backend systems with Node.js and Express.",
                typeOfCourse: "Paid",
                originalPrice: 3999,
                discountPrice: 1799,
                thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
                whatYouWillLearn: ["APIs", "Auth", "Scalability"],
                tag: ["nodejs", "backend"],
                slug: "nodejs-backend-engineering-v3",
                categoryId: new mongoose.Types.ObjectId("69c505811dec52581649e6d2"),
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
                thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
                whatYouWillLearn: ["Variables", "Loops", "Functions"],
                tag: ["javascript"],
                slug: "javascript-basics-v3",
                categoryId: new mongoose.Types.ObjectId("69c505811dec52581649e6d5"),
                level: "Beginner",
                status: "Published",
            },
            {
                courseName: "MongoDB Mastery",
                instructorName: "Mehul Joshi",
                instructorId: new mongoose.Types.ObjectId("699bfb1fda0b668afc6b751d"),
                description: "Advanced MongoDB concepts including aggregation and indexing.",
                typeOfCourse: "Paid",
                originalPrice: 2499,
                discountPrice: 999,
                thumbnailUrl: "https://images.unsplash.com/photo-1542831371-d531d36971e6",
                whatYouWillLearn: ["Aggregation", "Indexes", "Schema"],
                tag: ["mongodb", "database"],
                slug: "mongodb-mastery-v3",
                categoryId: new mongoose.Types.ObjectId("69c505811dec52581649e6d3"),
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
                thumbnailUrl: "https://images.unsplash.com/photo-1607743386760-88ac62b89b8a",
                whatYouWillLearn: ["Docker", "CI/CD", "Deployment"],
                tag: ["devops"],
                slug: "devops-crash-course-v3",
                categoryId: new mongoose.Types.ObjectId("69c505811dec52581649e6d4"),
                level: "Advance",
                status: "Published",
                isBoosted: true,
            },
        ];
        const createdCourses = await Course.insertMany(courses);
        console.log("✅ Courses seeded successfully");
    }
    catch (error) {
        console.error("❌ Error seeding courses:", error);
    }
}
async function unseedData() {
    await connectDB(process.env.MONGODB_URI);
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
    await Category.updateMany({}, {
        $pull: {
            courses: {
                $in: [
                    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78c8"),
                    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78c9"),
                    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78ca"),
                    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78cb"),
                    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78cc"),
                    new mongoose.Types.ObjectId("69c506848b3277d5c9bf78cd"),
                ],
            },
        },
    });
}
export const seedCourseEnrollments = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
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
    }
    catch (error) {
        console.error("❌ Error seeding enrollments:", error);
    }
};
export const updateCourseSlugs = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        const courses = await Course.find();
        for (const course of courses) {
            const instructor = await User.findById(course.instructorId);
            const newSlug = `${instructor?.firstName} ${instructor?.lastName}/${course.courseName}`;
            await Course.findByIdAndUpdate(course._id, { slug: newSlug });
        }
    }
    catch (error) {
        console.error("❌ Error updating course slugs:", error);
    }
};
export const seedSubsections = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        await Section.findByIdAndUpdate("69c97d9239aff5471ffc29ad", {
            $push: {
                subSectionIds: {
                    $each: [new mongoose.Types.ObjectId("69c97e0e39aff5471ffc29b0")],
                },
            },
        });
        await Section.findByIdAndUpdate("69c97e3c39aff5471ffc29bc", {
            $push: {
                subSectionIds: {
                    $each: [new mongoose.Types.ObjectId("69c97e8239aff5471ffc29bf")],
                },
            },
        });
        await Section.findByIdAndUpdate("69c97eab39aff5471ffc29cb", {
            $push: {
                subSectionIds: {
                    $each: [new mongoose.Types.ObjectId("69c97eef39aff5471ffc29ce")],
                },
            },
        });
        await Section.findByIdAndUpdate("69c97f2e39aff5471ffc29db", {
            $push: {
                subSectionIds: {
                    $each: [
                        new mongoose.Types.ObjectId("69c97f9c39aff5471ffc29de"),
                        new mongoose.Types.ObjectId("69c9800c39aff5471ffc29e4"),
                        new mongoose.Types.ObjectId("69c9806739aff5471ffc29ea"),
                        new mongoose.Types.ObjectId("69c980f639aff5471ffc29f6"),
                        new mongoose.Types.ObjectId("69c9812539aff5471ffc29fc"),
                    ],
                },
            },
        });
    }
    catch (err) { }
};
seedSubsections()
    .then(() => {
    console.log("Unseeding completed");
    process.exit(0);
})
    .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map