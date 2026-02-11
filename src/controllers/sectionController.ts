import { Types } from "mongoose";
import { Course } from "../models/CourseModel.js";
import { Section } from "../models/SectionModel.js";
import { StatusCode, type Handler } from "../types.js";
import { createSectionSchema } from "../validations/sectionValidation.js";

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
    const existingSection = await Section.findOne({ courseId }).populate(
      "courseId"
    );
    if (existingSection && existingSection.name === name) {
      res.status(StatusCode.DocumentExists).json({
        success: false,
        message: "Section with this name already exists for the course",
      });
      return;
    }
    const existingCourse = await Course.findOne({ _id: courseId });

    if (existingCourse?.instructorId.toString() != instructorId) {
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
      isRemoved: false,
    });
    if (!existingSection) {
      res.status(StatusCode.DocumentExists).json({
        success: false,
        message: "Section with this ID does not exist",
      });
      return;
    }
    await Section.updateMany(
      {
        _id: { $ne: sectionId },
        courseId: existingSection.courseId,
        order: { $gt: existingSection.order },
      },
      { $inc: { order: -1 } }
    );
    const section = await Section.updateOne(
      { _id: sectionId },
      { isRemoved: true, order: -1, lastOrder: existingSection.order }
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
export const changeSectionOrder: Handler = async (req, res): Promise<void> => {
  try {
    const instructorId = req.userId;
    const sectionId = req.params.sectionId;
    const { newOrder } = req.body;
    if (!sectionId) {
      res.status(StatusCode.InputError).json({
        success: false,
        message: "Section ID is required",
      });
      return;
    }
    const existingSection = await Section.findOne({
      _id: sectionId,
      isRemoved: false,
    });
    if (!existingSection) {
      res.status(StatusCode.DocumentExists).json({
        success: false,
        message: "Section with this ID does not exist",
      });
      return;
    }
    const oldOrder = existingSection.order;
    if (newOrder === oldOrder) {
      res.status(StatusCode.Success).json({
        success: true,
        message: "Section order is unchanged",
      });
      return;
    }
    if (newOrder < 1) {
      res.status(StatusCode.InputError).json({
        success: false,
        message: "New order must be greater than 0",
      });
      return;
    }
    const maxOrderSection = await Section.findOne({
      courseId: existingSection.courseId,
      isRemoved: false,
    }).sort({ order: -1 });
    const maxOrder = maxOrderSection ? maxOrderSection.order : 0;
    if (newOrder > maxOrder) {
      res.status(StatusCode.InputError).json({
        success: false,
        message: `New order must be between 1 and ${maxOrder}`,
      });
      return;
    }
    await Section.updateOne({ _id: sectionId }, { order: newOrder });
    if (newOrder > oldOrder) {
      await Section.updateMany(
        {
          _id: { $ne: sectionId },
          courseId: existingSection.courseId,
          order: { $gt: oldOrder, $lte: newOrder },
        },
        { $inc: { order: -1 } }
      );
    } else {
      await Section.updateMany(
        {
          _id: { $ne: sectionId },
          courseId: existingSection.courseId,
          order: { $gte: newOrder, $lt: oldOrder },
        },
        { $inc: { order: 1 } }
      );
    }
    res.status(StatusCode.Success).json({
      success: true,
      message: "Section order changed successfully",
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
export const updateSection: Handler = async (req, res): Promise<void> => {
  try {
    const { name } = req.body;
    const sectionId = req.params.sectionId;
    const instructorId = req.userId;
    if (!sectionId) {
      res.status(StatusCode.InputError).json({
        success: false,
        message: "Section ID is required",
      });
      return;
    }
    const currentSection = await Section.findOne({
      _id: sectionId,
      isRemoved: false,
    });
    if (!currentSection) {
      res.status(StatusCode.DocumentExists).json({
        success: false,
        message: "Section with this ID does not exist",
      });
      return;
    }
    const existingSection = await Section.findOne({
      courseId: currentSection.courseId,
    }).populate("courseId");
    if (existingSection && existingSection.name === name) {
      res.status(StatusCode.DocumentExists).json({
        success: false,
        message: "Section with this name already exists for the course",
      });
      return;
    }
    if (
      // @ts-ignore
      existingSection?.courseId.instructorId.toString() != instructorId
    ) {
      res.status(StatusCode.Unauthorized).json({
        success: false,
        message: "You are not authorized to add sections to this course",
      });
      return;
    }
    currentSection.name = name || currentSection.name;
    await currentSection.save();
    res.status(StatusCode.Success).json({
      success: true,
      message: "Section updated successfully",
      section: currentSection,
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
export const getAllSections: Handler = async (req, res): Promise<void> => {
  try {
    const instructorId = req.userId;
    const courseId = req.params.courseId;
    const sections = await Section.find({
      courseId: new Types.ObjectId(courseId),
      isRemoved: false,
    }).sort({ order: 1 });
    res.status(StatusCode.Success).json({
      success: true,
      message: "Sections retrieved successfully",
      sections,
    });
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      success: false,
      message: "Something went wrong from our side",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
};
export const getRemovedSections: Handler = async (req, res): Promise<void> => {
  try {
    const instructorId = req.userId;
    const courseId = req.params.courseId;
    const sections = await Section.find({
      courseId: new Types.ObjectId(courseId),
      isRemoved: true,
    })
      .sort({ order: 1 });
    if (sections.length === 0) {
      res.status(StatusCode.DocumentExists).json({
        success: false,
        message: "No removed sections found for this course",
      });
      return;
    }
    const existingCourse = await Course.findOne({ _id: courseId });
    if (existingCourse?.instructorId.toString() != instructorId) {
      res.status(StatusCode.Unauthorized).json({
        success: false,
        message: "You are not authorized to view sections of this course",
      });
      return;
    }
    res.status(StatusCode.Success).json({
      success: true,
      message: "Removed sections retrieved successfully",
      sections,
    });
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      success: false,
      message: "Something went wrong from our side",
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
};
export const undoRemoveSection: Handler = async (req, res): Promise<void> => {
  try {
    const sectionId = req.params.sectionId;
    const courseId = req.params.courseId;
    let existingSection;
    if (req.url.includes("/undoremoved")) {
      existingSection = await Section.findOne({
        _id: sectionId,
        isRemoved: true,
      });
    }else{
      existingSection = await Section.findOne({
        courseId: new Types.ObjectId(courseId),
        isRemoved: true,
      }).sort({ order: -1 });
    }
    if (!existingSection) {
      res.status(StatusCode.DocumentExists).json({
        success: false,
        message: "Section with this ID does not exist or is not removed",
      });
      return;
    }
    await Section.updateOne(
      { _id: existingSection._id },
      { isRemoved: false, order: existingSection.lastOrder, lastOrder: null }
    );
    await Section.updateMany(
      {
        _id: { $ne: existingSection._id },
        courseId: existingSection.courseId,
        order: { $gte: existingSection.lastOrder || 1 },
      },
      { $inc: { order: 1 } }
    );
    res.status(StatusCode.Success).json({
      success: true,
      message: "Section restored successfully",
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