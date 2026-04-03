import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Types } from "mongoose";
import { s3 } from "../../../shared/config/s3Config.js";
import { ApiResponse } from "../../../shared/lib/ApiResponse.js";
import { AppError } from "../../../shared/lib/AppError.js";
import { asyncHandler } from "../../../shared/lib/asyncHandler.js";
import { deleteObject, generateSignedUrl, } from "../../../shared/utils/getSignedUrl.js";
import { Course } from "../../course/CourseModel.js";
import { Section } from "../../section/SectionModel.js";
import { SubSection } from "../SubSectionModel.js";
import { Material } from "./MaterialModel.js";
import { materialSchema } from "./materialValidation.js";
import { isEnrolled } from "../subsection.utils.js";
export const isValidInstructor = async (courseId, userId, accountType) => {
    if (accountType === "admin") {
        const course = await Course.findById(courseId);
        return course;
    }
    const course = await Course.findOne({ _id: courseId, instructorId: userId });
    if (course) {
        return course;
    }
    else {
        throw AppError.notFound("Course not found");
    }
};
export const addMaterial = asyncHandler(async (req, res) => {
    const parsedMaterialData = materialSchema.safeParse(req.body);
    const userId = new Types.ObjectId(req.userId);
    if (!userId) {
        throw AppError.unauthorized("User ID is required");
    }
    if (!parsedMaterialData.success) {
        throw AppError.badRequest(parsedMaterialData.error.issues[0]?.message || "Invalid input data");
    }
    const { materialType, description, courseId, title, sectionId, materialSize, materialS3Key, } = parsedMaterialData.data;
    const course = await isValidInstructor(new Types.ObjectId(courseId), userId, req.user?.accountType);
    if (!course) {
        throw AppError.unauthorized("You are not authorized to add material to this course.");
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
    await Course.findByIdAndUpdate(courseId, {
        $inc: { totalMaterials: 1, totalSubsections: 1 },
    });
    ApiResponse.created(res, {
        material,
    }, "Material added successfully");
});
export const getMaterial = asyncHandler(async (req, res) => {
    const materialId = req.params.materialId;
    const material = await Material.findById(materialId);
    if (!material) {
        throw AppError.notFound("Material not found");
    }
    const userId = new Types.ObjectId(req.userId);
    if (!(await isEnrolled(userId.toString(), material.courseId.toString()))) {
        throw AppError.unauthorized("You are not enrolled in the course for this material.");
    }
    let materialURL = material.contentUrl;
    if (material.URLExpiration && material.URLExpiration < new Date()) {
        materialURL = await generateSignedUrl(material.materialS3Key);
    }
    ApiResponse.success(res, {
        material: {
            ...material.toObject(),
            contentUrl: materialURL,
        },
    }, "Material retrieved successfully");
});
export const deleteMaterial = asyncHandler(async (req, res) => {
    const subsectionId = req.params.subsectionId;
    if (!subsectionId || typeof subsectionId !== "string") {
        throw AppError.badRequest("Subsection ID is required");
    }
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
        throw AppError.notFound("Subsection not found");
    }
    const course = await isValidInstructor(new Types.ObjectId(subsection.courseId), new Types.ObjectId(req.userId), req.user?.accountType);
    if (!course) {
        throw AppError.notFound("Course not found or you are not authorized to delete this material.");
    }
    const material = await Material.findOneAndDelete({
        subsectionId: new Types.ObjectId(subsectionId),
    });
    if (!material) {
        throw AppError.notFound("Material not found");
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
    await Course.findByIdAndUpdate(material.courseId, {
        $inc: { totalMaterials: -1, totalSubsections: -1 },
    });
    ApiResponse.success(res, {}, "Material deleted successfully.");
});
export const updateMaterial = asyncHandler(async (req, res) => {
    const subsectionId = req.params.subsectionId;
    if (!subsectionId || typeof subsectionId !== "string") {
        throw AppError.badRequest("Subsection ID is required");
    }
    const parsedMaterialData = materialSchema.partial().safeParse(req.body);
    if (!parsedMaterialData.success) {
        throw AppError.badRequest(parsedMaterialData.error.issues[0]?.message || "Invalid input data");
    }
    const { materialType, description, title, materialSize, materialS3Key } = parsedMaterialData.data;
    const subsection = await SubSection.findByIdAndUpdate(subsectionId, {
        $set: {
            title: title || undefined,
            description: description || undefined,
        },
    });
    if (!subsection) {
        throw AppError.notFound("Subsection not found");
    }
    const course = await isValidInstructor(new Types.ObjectId(subsection.courseId), new Types.ObjectId(req.userId), req.user?.accountType);
    if (!course) {
        throw AppError.notFound("Course not found or you are not authorized to update this material.");
    }
    const materialURL = await generateSignedUrl(materialS3Key || "");
    const material = await Material.findOneAndUpdate({ subsectionId: new Types.ObjectId(subsectionId) }, {
        materialType: materialType || undefined,
        materialName: title || undefined,
        materialSize: materialSize || undefined,
        materialS3Key: materialS3Key || undefined,
        contentUrl: materialURL || undefined,
        description: description || undefined,
    }, { new: false });
    if (!material) {
        throw AppError.notFound("Material not found");
    }
    await deleteObject(material.materialS3Key || "");
    ApiResponse.success(res, {
        material: {
            ...material.toObject(),
            contentUrl: materialURL,
        },
    }, "Material updated successfully");
});
//# sourceMappingURL=materialController.js.map