import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import CourseProgress from "../course/CourseProgress.js";
import { SubSection } from "./SubSectionModel.js";
import { isValidInstructor } from "./material/materialController.js";

export const getAllSubsections = asyncHandler(async (req, res) => {
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
      subsections
    },
    "SubSections fetched successfully",
  );
});
export const markSubsectionAsCompleted = asyncHandler(async (req, res) => {
  const subsectionId = req.params.subsectionId;
  const userId = req.userId;
  if (!userId) {
    throw AppError.unauthorized("User ID is required");
  }
  if (!subsectionId) {
    throw AppError.badRequest("SubSection ID is required");
  }
  const subsection = await SubSection.findById(subsectionId);
  if (!subsection) {
    throw AppError.notFound("SubSection not found");
  }
  let courseProgress = await CourseProgress.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(subsection.courseId),
    },
    { $push: { completedSubsections: new Types.ObjectId(subsectionId) } },
    { new: true },
  );
  if (!courseProgress)
    courseProgress = await CourseProgress.create({
      courseId: new Types.ObjectId(subsection.courseId),
      userId: new Types.ObjectId(userId),
      progress: 0,
      completed: false,
      completedSubsections: [new Types.ObjectId(subsectionId)],
    });
  const totalSubsections = await SubSection.countDocuments({
    courseId: subsection.courseId,
    isActive: true,
  });
  const completedSubsections = courseProgress.completedSubsections.length || 0;
  const progress = (completedSubsections / totalSubsections) * 100;
  courseProgress.progress = progress;
  await courseProgress.save();

  ApiResponse.success(
    res,
    { courseProgress },
    "SubSection marked as completed and course progress updated successfully",
  );
});
export const deleteSubsection = asyncHandler(async (req, res) => {
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
  const validInstructor = await isValidInstructor(subsection.courseId, instructorId);
  if (!validInstructor) {
    throw AppError.unauthorized("You are not authorized to delete this subsection");
  }
  subsection.isActive = false;
  await subsection.save();
  ApiResponse.success(
    res,
    {
      subsection,
    },
    "SubSection deleted successfully",
  );
});