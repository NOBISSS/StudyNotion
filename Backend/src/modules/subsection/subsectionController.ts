import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { Types } from "mongoose";
import { s3 } from "../../shared/config/s3Config.js";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import type { Handler } from "../../shared/types.js";
import CourseProgress from "../course/CourseProgress.js";
import { SubSection } from "./SubSectionModel.js";
import { Material } from "./material/MaterialModel.js";
import { isValidInstructor } from "./material/materialController.js";
import { updateSubSectionSchema } from "./subsectionValidation.js";
import Video from "./video/VideoModel.js";
import VideoProgress from "./video/VideoProgressModel.js";

export const getAllSubsections: Handler = asyncHandler(async (req, res) => {
  const sectionId = req.params.sectionId;
  if (!sectionId) {
    throw AppError.badRequest("Section ID is required");
  }
  const subsections = await SubSection.find({ sectionId, isActive: true }).sort(
    { createdAt: 1 },
  );
  if (!subsections) {
    throw AppError.notFound("SubSections not found");
  }
  ApiResponse.success(
    res,
    {
      subsections,
    },
    "SubSections fetched successfully",
  );
});
export const markSubsectionAsCompleted: Handler = asyncHandler(
  async (req, res) => {
    const { subsectionId } = req.params;
    const userId = req.userId;

    if (!userId) throw AppError.unauthorized("User ID is required");
    if (!subsectionId || typeof subsectionId !== "string") throw AppError.badRequest("SubSection ID is required");

    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) throw AppError.notFound("SubSection not found");

    const courseObjectId = new Types.ObjectId(subsection.courseId);
    const userObjectId = new Types.ObjectId(userId);
    const subsectionObjectId = new Types.ObjectId(subsectionId);

    // Get or create course progress
    let courseProgress = await CourseProgress.findOne({
      userId: userObjectId,
      courseId: courseObjectId,
    });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseId: courseObjectId,
        userId: userObjectId,
        progress: 0,
        completed: false,
        completedSubsections: [],
      });
    }

    const alreadyCompleted = courseProgress.completedSubsections.some((id) =>
      id.equals(subsectionObjectId),
    );
    if (!alreadyCompleted) {
      // ── MARK AS COMPLETE ────────────────────────────────────────────────
      courseProgress.completedSubsections.push(subsectionObjectId);

      if (subsection.contentType === "video") {
        const video = await Video.findOne({ subsectionId: subsectionObjectId });
        if (!video)
          throw AppError.notFound("Video not found for this subsection");

        // upsert — handles both first-time and re-completion
        await VideoProgress.findOneAndUpdate(
          {
            userId: userObjectId,
            videoId: video._id,
            courseId: courseObjectId,
            subSectionId: subsectionObjectId,
          },
          {
            $set: {
              isCompleted: true,
              currentTime: video.duration || 0,
              watchedPercentage: 100,
              duration: video.duration || 0, // ← fix: store total duration for hoursLearned calc
            },
          },
          { upsert: true, new: true },
        );
      }
    } else if(alreadyCompleted && req.query.toggle !== "true") {
      // ── UNMARK (TOGGLE OFF) ─────────────────────────────────────────────
      courseProgress.completedSubsections =
        courseProgress.completedSubsections.filter(
          (id) => !id.equals(subsectionObjectId),
        );

      if (subsection.contentType === "video") {
        const video = await Video.findOne({ subsectionId: subsectionObjectId });
        if (!video)
          throw AppError.notFound("Video not found for this subsection");

        // Only update if record exists — don't create a "not completed" record
        await VideoProgress.findOneAndUpdate(
          {
            userId: userObjectId,
            videoId: video._id,
            courseId: courseObjectId,
            subSectionId: subsectionObjectId,
          },
          {
            $set: {
              isCompleted: false,
              currentTime: 0,
              watchedPercentage: 0,
              // duration stays intact — don't wipe it
            },
          },
          // no upsert here ← fix
        );
      }
    }

    // ── Recalculate Progress ──────────────────────────────────────────────
    const totalSubsections = await SubSection.countDocuments({
      courseId: subsection.courseId,
      isActive: true,
      isAvailable: true, // only count available subsections
    });

    const completedCount = courseProgress.completedSubsections.length;
    courseProgress.progress =
      totalSubsections > 0
        ? Math.round((completedCount / totalSubsections) * 100)
        : 0;

    if (totalSubsections > 0 && completedCount === totalSubsections) {
      courseProgress.completed = true;
      courseProgress.completionDate = new Date();
    } else {
      // Fix: reset completion if user unchecked a subsection
      courseProgress.completed = false;
    }

    await courseProgress.save();

    ApiResponse.success(
      res,
      { courseProgress },
      "SubSection completion toggled and progress updated successfully",
    );
  },
);
export const deleteSubsection: Handler = asyncHandler(async (req, res) => {
  const subsectionId = req.params.subsectionId;
  const instructorId = req.userId;
  if (!subsectionId) {
    throw AppError.badRequest("SubSection ID is required");
  }
  if (!instructorId) {
    throw AppError.unauthorized("Instructor ID is required");
  }
  const subsection = await SubSection.findById(subsectionId);
  if (!subsection) {
    throw AppError.notFound("SubSection not found");
  }
  const validInstructor = await isValidInstructor(
    subsection.courseId,
    instructorId,
  );
  if (!validInstructor) {
    throw AppError.unauthorized(
      "You are not authorized to delete this subsection",
    );
  }
  subsection.isActive = false;
  await subsection.save();
  const subsectionVideo = await Video.findOne({
    subsectionId: new Types.ObjectId(subsectionId as string),
  });
  if (subsectionVideo) {
    const keysToDelete = [
      { Key: subsectionVideo.videoS3Key },
      subsectionVideo.originalVideoS3Key != null
        ? {
            Key: subsectionVideo.originalVideoS3Key
              ? subsectionVideo.originalVideoS3Key
              : undefined,
          }
        : null,
    ];

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Delete: {
        Objects: keysToDelete.filter((key) => key !== null) as {
          Key: string;
        }[],
      },
    });
    await s3.send(deleteCommand);
    subsectionVideo.isActive = false;
    await subsectionVideo.save({ validateBeforeSave: false });
  }
  const subsectionMaterial = await Material.findOne({
    subsectionId: new Types.ObjectId(subsectionId as string),
  });
  if (subsectionMaterial) {
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Delete: {
        Objects: [
          { Key: subsectionMaterial.materialS3Key },
          {
            Key: subsectionMaterial.originalMaterialS3Key
              ? subsectionMaterial.originalMaterialS3Key
              : undefined,
          },
        ],
      },
    });
    await s3.send(deleteCommand);

    subsectionMaterial.isActive = false;
    await subsectionMaterial.save();
  }
  ApiResponse.success(
    res,
    {
      subsection,
    },
    "SubSection deleted successfully",
  );
});
export const updateSubsection: Handler = asyncHandler(async (req, res) => {
  const subsectionId = req.params.subsectionId;
  const instructorId = req.userId;
  if (!subsectionId) {
    throw AppError.badRequest("SubSection ID is required");
  }
  if (!instructorId) {
    throw AppError.unauthorized("Instructor ID is required");
  }
  const parsedData = updateSubSectionSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw AppError.badRequest(
      parsedData?.error?.issues[0]?.message || "Invalid input",
    );
  }
  const subsection = await SubSection.findById(subsectionId);
  if (!subsection) {
    throw AppError.notFound("SubSection not found");
  }
  const validInstructor = await isValidInstructor(
    subsection.courseId,
    instructorId,
  );
  if (!validInstructor) {
    throw AppError.unauthorized(
      "You are not authorized to update this subsection",
    );
  }
  const { description, title, isPreview } = parsedData.data;
  subsection.title = title;
  subsection.description = description;
  subsection.isPreview = isPreview;
  await subsection.save();
  ApiResponse.success(
    res,
    {
      subsection,
    },
    "SubSection updated successfully",
  );
});
