import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  course: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

export const Category = model("Category", CategorySchema);
