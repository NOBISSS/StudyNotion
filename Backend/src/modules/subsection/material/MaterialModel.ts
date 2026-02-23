import { model, Schema, Types } from "mongoose";

const MaterialSchema = new Schema(
  {
    materialName: { type: String },
    contentUrl: { type: String, required: true },
    materialType: { type: String, required: true },
    materialSize: { type: Number },
    materialS3Key: { type: String, required: true },
    URLExpiration: { type: Date },
    subsectionId: { type: Types.ObjectId, ref: "SubSection", required: true },
  },
  { timestamps: true },
);

export const Material = model("Material", MaterialSchema);
