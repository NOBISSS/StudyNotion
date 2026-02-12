import { Types } from "mongoose";
import { Course } from "../models/CourseModel.js";
import { Material } from "../models/MaterialModel.js";
import { Section } from "../models/SectionModel.js";
import { SubSection } from "../models/SubSectionModel.js";
import { StatusCode, type Handler } from "../types.js";
import { generateSignedUrl } from "../utils/getSignedUrl.js";
import { materialSchema } from "../validations/materialValidation.js";

export const isValidInstructor = async (
  courseId: Types.ObjectId,
  userId: Types.ObjectId,
) => {
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
      contentUrl,
      materialType,
      description,
      courseId,
      title,
      sectionId,
      materialSize,
      materialS3Key,
      URLExpiration,
    } = parsedMaterialData.data;
    const course = await isValidInstructor(
      new Types.ObjectId(courseId),
      userId,
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
    const materialId = req.params.id;
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