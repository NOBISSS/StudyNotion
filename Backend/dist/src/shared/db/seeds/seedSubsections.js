import dotenv from "dotenv";
import mongoose from "mongoose";
import { Section } from "../../../modules/section/SectionModel.js";
import { SubSection } from "../../../modules/subsection/SubSectionModel.js";
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
updateSections()
    .then(() => {
    console.log("Section updates completed");
    process.exit(0);
})
    .catch((err) => {
    console.error("Error updating sections:", err);
    process.exit(1);
});
//# sourceMappingURL=seedSubsections.js.map