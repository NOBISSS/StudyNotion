import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Types } from "mongoose";
import { s3 } from "../config/s3Config.js";
import { Course } from "../models/CourseModel.js";
import { Material } from "../models/MaterialModel.js";
import { Section } from "../models/SectionModel.js";
import { SubSection } from "../models/SubSectionModel.js";
import { StatusCode, type Handler } from "../types.js";
import { deleteObject, generateSignedUrl } from "../utils/getSignedUrl.js";
import { materialSchema } from "../validations/materialValidation.js";

export const isValidInstructor = async (
  courseId: Types.ObjectId,
  userId: Types.ObjectId,
  accountType?: string,
) => {
  if (accountType === "admin") {
    const course = await Course.findById(courseId);
    return course;
  }
  const course = await Course.findOne({ _id: courseId, instructorId: userId });
  if (course) {
    return course;
  } else null;
};

export const addMaterial: Handler = async (req, res) => {
  try {
    const parsedMaterialData = materialSchema.safeParse(req.body);
    const userId = new Types.ObjectId(req.userId);
    if (!userId) {
      res.status(StatusCode.Unauthorized).json({
        message: "Unauthorized. User ID is missing.",
      });
      return;
    }
    if (!parsedMaterialData.success) {
      return res.status(StatusCode.InputError).json({
        message: parsedMaterialData.error.issues[0]?.message,
      });
    }
    const {
      materialType,
      description,
      courseId,
      title,
      sectionId,
      materialSize,
      materialS3Key,
    } = parsedMaterialData.data;
    console.log(userId);
    const course = await isValidInstructor(
      new Types.ObjectId(courseId),
      userId,
      req.user?.accountType,
    );
    if (!course) {
      res.status(StatusCode.Unauthorized).json({
        message: "You are not authorized to add material to this course.",
      });
      return;
    }
    const subsection = await SubSection.create({
      title,
      description: description || "",
      courseId,
      contentType: "material",
      sectionId,
    });
    const materialURL = await generateSignedUrl(materialS3Key);
    const material = await Material.create({
      materialName: title,
      contentUrl: materialURL,
      materialType,
      materialSize: materialSize || null,
      materialS3Key,
      URLExpiration: new Date(Date.now() + 3600000),
      subsectionId: subsection._id,
    });
    await Section.findByIdAndUpdate(sectionId, {
      $push: { subSectionIds: material._id },
    });
    res.status(StatusCode.Success).json({
      message: "Material added successfully.",
      data: material,
    });
    return;
  } catch (err) {
    res.status(StatusCode.ServerError).json({
      message: "An error occurred while adding material.",
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return;
  }
};
export const getMaterial: Handler = async (req, res) => {
  try {
    const materialId = req.params.materialId;
    const material = await Material.findById(materialId);
    if (!material) {
      res.status(StatusCode.NotFound).json({ message: "Material not found" });
      return;
    }
    let materialURL = material.contentUrl;
    if (material.URLExpiration && material.URLExpiration < new Date()) {
      materialURL = await generateSignedUrl(material.materialS3Key);
    }
    res.status(StatusCode.Success).json({
      message: "Material retrieved successfully.",
      material: {
        ...material.toObject(),
        contentUrl: materialURL,
      },
    });
    return;
  } catch (err) {
    res.status(StatusCode.ServerError).json({
      message: "An error occurred while retrieving material.",
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return;
  }
};
export const deleteMaterial: Handler = async (req, res) => {
  try {
    const subsectionId = req.params.subsectionId;

    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      res.status(StatusCode.NotFound).json({ message: "Subsection not found" });
      return;
    }
    const course = await isValidInstructor(
      new Types.ObjectId(subsection.courseId),
      new Types.ObjectId(req.userId),
      req.user?.accountType,
    );
    if (!course) {
      res.status(StatusCode.NotFound).json({
        message:
          "Course not found or you are not authorized to delete this material.",
      });
      return;
    }

    const material = await Material.findOneAndDelete({
      subsectionId: new Types.ObjectId(subsectionId),
    });
    if (!material) {
      res.status(StatusCode.NotFound).json({ message: "Material not found" });
      return;
    }
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: material.materialS3Key || "",
    });
    await s3.send(deleteCommand);
    subsection.isActive = false;
    await subsection.save();
    await Section.findByIdAndUpdate(subsection.sectionId, {
      $pull: { subSectionIds: material._id },
    });
    res
      .status(StatusCode.Success)
      .json({ message: "Material deleted successfully." });
    return;
  } catch (err) {
    res.status(StatusCode.ServerError).json({
      message: "An error occurred while deleting material.",
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return;
  }
};
export const updateMaterial: Handler = async (req, res) => {
  try {
    const subsectionId = req.params.subsectionId;
    const parsedMaterialData = materialSchema.partial().safeParse(req.body);
    if (!parsedMaterialData.success) {
      return res.status(StatusCode.InputError).json({
        message: parsedMaterialData.error.issues[0]?.message,
      });
    }
    const { materialType, description, title, materialSize, materialS3Key } =
      parsedMaterialData.data;
    const subsection = await SubSection.findByIdAndUpdate(subsectionId, {
      $set: {
        title: title || undefined,
        description: description || undefined,
      },
    });
    if (!subsection) {
      res.status(StatusCode.NotFound).json({ message: "Subsection not found" });
      return;
    }
    const course = await isValidInstructor(
      new Types.ObjectId(subsection.courseId),
      new Types.ObjectId(req.userId),
      req.user?.accountType,
    );
    if (!course) {
      res.status(StatusCode.NotFound).json({
        message:
          "Course not found or you are not authorized to update this material.",
      });
      return;
    }
    const materialURL = await generateSignedUrl(materialS3Key || "");
    const material = await Material.findOneAndUpdate(
      { subsectionId: new Types.ObjectId(subsectionId) },
      {
        materialType: materialType || undefined,
        materialName: title || undefined,
        materialSize: materialSize || undefined,
        materialS3Key: materialS3Key || undefined,
        contentUrl: materialURL || undefined,
        description: description || undefined,
      },
      { new: false },
    );
    if (!material) {
      res.status(StatusCode.NotFound).json({ message: "Material not found" });
      return;
    }
    await deleteObject(material.materialS3Key || "");
    res.status(StatusCode.Success).json({
      message: "Material updated successfully.",
      material: {
        ...material.toObject(),
        contentUrl: materialURL,
      },
    });
  } catch (err) {
    res.status(StatusCode.ServerError).json({
      message: "An error occurred while updating material.",
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return;
  }
};
