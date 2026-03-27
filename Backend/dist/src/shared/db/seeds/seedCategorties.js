import mongoose from "mongoose";
import { Category } from "../../../modules/category/CategoryModel.js";
import { connectDB } from "../index.js";
import dotenv from "dotenv";
dotenv.config();
export const seedCategories = async () => {
    await connectDB(process.env.MONGODB_URI);
    try {
        const categories = [
            {
                name: "Uncategorized",
                description: "Default category for courses without a specific category.",
                isActive: true,
                courses: [],
            },
        ];
        await Category.insertMany(categories);
        console.log("✅ Categories seeded successfully");
    }
    catch (error) {
        console.error("❌ Error seeding categories:", error);
    }
};
export const attachCoursesToCategories = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        await Category.findByIdAndUpdate("69555c1aed5633e6e7cba61b", {
            $addToSet: {
                courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9563"),
            },
        });
        await Category.findByIdAndUpdate("69c505811dec52581649e6d1", {
            $addToSet: {
                courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9564"),
            },
        });
        await Category.findByIdAndUpdate("69c505811dec52581649e6d2", {
            $addToSet: {
                courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9565"),
            },
        });
        await Category.findByIdAndUpdate("69c505811dec52581649e6d5", {
            $addToSet: {
                courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9566"),
            },
        });
        await Category.findByIdAndUpdate("69c505811dec52581649e6d3", {
            $addToSet: {
                courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9567"),
            },
        });
        await Category.findByIdAndUpdate("69c505811dec52581649e6d4", {
            $addToSet: {
                courses: new mongoose.Types.ObjectId("69c5124874ca6cacf3eb9568"),
            },
        });
        console.log("✅ Courses correctly attached to categories");
    }
    catch (error) {
        console.error("❌ Error attaching courses:", error);
    }
};
seedCategories()
    .then(() => {
    console.log("courses attached to categories successfully");
})
    .catch((error) => console.log("error", error));
//# sourceMappingURL=seedCategorties.js.map