import { SubSection } from "../models/SubSectionModel.js";
import { StatusCode, type Handler } from "../types.js";

export const getAllSubsections: Handler = async (req, res) => {
  try {
    const sectionId = req.params.sectionId;
    if (!sectionId) {
      res
        .status(StatusCode.InputError)
        .json({ message: "Section ID is required" });
      return;
    }
    const subsections = await SubSection.find({ sectionId, isActive: true });
    if (!subsections) {
      res.status(StatusCode.NotFound).json({ message: "No subsections found" });
      return;
    }
    res.status(StatusCode.Success).json({
      message: "Subsections retrieved successfully",
      subsections,
    });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({
        message: "An error occurred while fetching subsections.",
        error: err instanceof Error ? err.message : "Unknown error",
      });
  }
};
