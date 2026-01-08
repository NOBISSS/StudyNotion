import z from "zod";
import { Section } from "../models/SectionModel.js";
import { StatusCode, type Handler } from "../types.js";

const createSectionSchema = z.object({
  name: z
    .string({ error: "Section name is required" })
    .min(1, "Section name is required"),
  courseId: z.string(),
  order: z.number().min(0, "Order must be a non-negative number"),
});

export const createSection: Handler = async (req, res): Promise<void> => {
  try {
    const parsedData = createSectionSchema.safeParse(req.body);
    const instructorId = req.userId;
    if (!parsedData.success) {
      res.status(StatusCode.InputError).json({
        success: false,
        message: parsedData.error.issues[0]?.message || "Invalid input data",
      });
      return;
    }
    const { name, courseId, order } = parsedData.data;
    const existingSection = await Section.findOne({ name, courseId });
    if (existingSection) {
      res.status(StatusCode.DocumentExists).json({
        success: false,
        message: "Section with this name already exists for the course",
      });
      return;
    }

    const courseBelongsToInstructor = await Section.findOne({
      courseId,
      instructorId,
    });
    if (!courseBelongsToInstructor) {
      res.status(StatusCode.Unauthorized).json({
        success: false,
        message: "You are not authorized to add sections to this course",
      });
      return;
    }
    const section = await Section.create({
      name,
      courseId,
      order,
    });
    await Section.updateMany(
      { courseId, _id: { $ne: section._id }, order: { $gte: order } },
      { $inc: { order: 1 } }
    );
    res.status(StatusCode.Success).json({
      success: true,
      message: "Section created successfully",
      section,
    });
    return;
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      success: false,
      message: "Something went wrong from our side",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
};
export const removeSection: Handler = async (req, res): Promise<void> => {
  try {
    const instructorId = req.userId;
    const sectionId = req.params.sectionId;
    if (!sectionId) {
      res.status(StatusCode.InputError).json({
        success: false,
        message: "Section ID is required",
      });
      return;
    }
    const existingSection = await Section.findOne({
      _id: sectionId,
      instructorId,
      isRemoved: false,
    });
    if (!existingSection) {
      res.status(StatusCode.DocumentExists).json({
        success: false,
        message: "Section with this ID does not exist",
      });
      return;
    }

    const section = await Section.updateOne(
      { _id: sectionId },
      { isRemoved: true }
    );
    res.status(StatusCode.Success).json({
      success: true,
      message: "Section removed successfully",
      section,
    });
    return;
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      success: false,
      message: "Something went wrong from our side",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
};
