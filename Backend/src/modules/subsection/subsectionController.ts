import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { SubSection } from "./SubSectionModel.js";

export const getAllSubsections = asyncHandler(async (req, res) => {
  const sectionId = req.params.sectionId;
  if (!sectionId) {
    throw AppError.badRequest("Section ID is required");
  }
  const subsections = await SubSection.find({ sectionId, isActive: true });
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
