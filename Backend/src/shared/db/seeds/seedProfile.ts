import mongoose from "mongoose";
import { Profile } from "../../../modules/user/ProfileModel.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/studynotion"; // adjust

async function updateProfiles() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

   const profile = await Profile.updateMany({
    country:"ind",
   },{
    $set:{
        country:"IN"
    }
   })
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

updateProfiles().then(() => {
  console.log("Profile update completed");
  process.exit(0);
}).catch((error) => {
  console.error("Error updating profiles:", error);
  process.exit(1);
});