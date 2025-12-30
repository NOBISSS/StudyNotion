// category [icon: tag, color: green] {
//     categoryId objectId pk
//     name string
//     description string
//     createdAt Date
//     updatedAt Date
//     course [objectId] fk 
//   }
import { Schema, model } from "mongoose";

const categorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
    },
    { timestamps: true }
);

export const Category = model("Category", categorySchema);