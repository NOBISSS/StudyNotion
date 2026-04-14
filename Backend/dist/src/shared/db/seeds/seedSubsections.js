import dotenv from "dotenv";
import mongoose from "mongoose";
import { Section } from "../../../modules/section/SectionModel.js";
import { SubSection } from "../../../modules/subsection/SubSectionModel.js";
import { Material } from "../../../modules/subsection/material/MaterialModel.js";
dotenv.config();
const MONGO_URI = process.env.MONGODB_URI;
async function updateSections() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
        const subsections = await SubSection.find({ isActive: false });
        for (const subsection of subsections) {
            const courseId = subsection.courseId;
            const sectionId = subsection.sectionId;
            await Section.findByIdAndUpdate(sectionId, {
                $set: {
                    $pull: { subsections: new mongoose.Types.ObjectId(subsection._id) },
                },
            });
        }
    }
    catch (error) {
        console.error("Seeding failed:", error);
    }
    finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}
async function updateMaterials() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
        const materials = await Material.find();
        for (const material of materials) {
            material.mimeType = material.materialType;
            await material.save();
        }
    }
    catch (error) {
        console.error("Seeding failed:", error);
    }
    finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}
updateMaterials()
    .then(() => {
    console.log("Material updates completed");
    process.exit(0);
})
    .catch((err) => {
    console.error("Error updating materials:", err);
    process.exit(1);
});
//# sourceMappingURL=seedSubsections.js.map