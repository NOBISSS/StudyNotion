import mongoose from "mongoose";

export default async function () {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch (err) {
    console.log("Teardown error:", err);
  }
}
