import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { StatusCode } from "../../shared/types.js";
import { Course } from "../course/CourseModel.js";
import { Section } from "./SectionModel.js";
import { createSectionSchema } from "./sectionValidation.js";
export const createSection = asyncHandler(async (req, res) => {
    const parsedData = createSectionSchema.safeParse(req.body);
    const instructorId = req.userId;
    if (!parsedData.success) {
        throw AppError.badRequest(parsedData.error.issues[0]?.message || "Invalid section data");
    }
    const { sectionName: name, courseId, order } = parsedData.data;
    const existingSection = await Section.findOne({ courseId }).populate("courseId");
    if (existingSection && existingSection.name === name) {
        throw AppError.conflict("Section with this name already exists for the course");
    }
    const existingCourse = await Course.findOne({ _id: courseId });
    if (existingCourse?.instructorId.toString() != instructorId &&
        req.accountType !== "admin") {
        throw AppError.unauthorized("You are not authorized to add sections to this course");
    }
    const sectionCount = await Section.countDocuments({ courseId });
    const newOrder = order !== undefined ? order : sectionCount + 1;
    await Section.updateMany({ courseId, order: { $gte: newOrder } }, { $inc: { order: 1 } });
    const section = await Section.create({
        name,
        courseId,
        order: newOrder,
    });
    ApiResponse.created(res, {
        section,
    }, "Section created successfully");
});
export const removeSection = asyncHandler(async (req, res) => {
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
        throw AppError.notFound("Section with this ID does not exist");
    }
    await Section.updateMany({
        _id: { $ne: sectionId },
        courseId: existingSection.courseId,
        order: { $gt: existingSection.order },
    }, { $inc: { order: -1 } });
    const section = await Section.updateOne({ _id: sectionId }, { isRemoved: true, order: -1, lastOrder: existingSection.order });
    ApiResponse.success(res, {
        section,
    }, "Section removed successfully");
});
export const changeSectionOrder = asyncHandler(async (req, res) => {
    const instructorId = req.userId;
    const sectionId = req.params.sectionId;
    const { newOrder } = req.body;
    if (!sectionId) {
        throw AppError.badRequest("Section ID is required");
    }
    const existingSection = await Section.findOne({
        _id: sectionId,
        isRemoved: false,
    });
    if (!existingSection) {
        throw AppError.notFound("Section with this ID does not exist");
    }
    const oldOrder = existingSection.order;
    if (newOrder === oldOrder) {
        throw AppError.badRequest("Section order is unchanged");
    }
    if (newOrder < 1) {
        throw AppError.badRequest("New order must be greater than 0");
    }
    const maxOrderSection = await Section.findOne({
        courseId: existingSection.courseId,
        isRemoved: false,
    }).sort({ order: -1 });
    const maxOrder = maxOrderSection ? maxOrderSection.order : 0;
    if (newOrder > maxOrder) {
        throw AppError.badRequest(`New order must be between 1 and ${maxOrder}`);
    }
    await Section.updateOne({ _id: sectionId }, { order: newOrder });
    if (newOrder > oldOrder) {
        await Section.updateMany({
            _id: { $ne: sectionId },
            courseId: existingSection.courseId,
            order: { $gt: oldOrder, $lte: newOrder },
        }, { $inc: { order: -1 } });
    }
    else {
        await Section.updateMany({
            _id: { $ne: sectionId },
            courseId: existingSection.courseId,
            order: { $gte: newOrder, $lt: oldOrder },
        }, { $inc: { order: 1 } });
    }
    ApiResponse.success(res, {}, "Section order updated successfully");
});
export const updateSection = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const sectionId = req.params.sectionId;
    const instructorId = req.userId;
    if (!sectionId) {
        throw AppError.badRequest("Section ID is required");
    }
    const currentSection = await Section.findOne({
        _id: sectionId,
        isRemoved: false,
    });
    if (!currentSection) {
        throw AppError.notFound("Section with this ID does not exist");
    }
    const existingSection = await Section.findOne({
        courseId: currentSection.courseId,
    }).populate("courseId");
    if (existingSection && existingSection.name === name) {
        throw AppError.conflict("Section with this name already exists for the course");
    }
    if (existingSection?.courseId.instructorId.toString() != instructorId || req.accountType !== "admin") {
        throw AppError.unauthorized("You are not authorized to add sections to this course");
    }
    currentSection.name = name || currentSection.name;
    await currentSection.save();
    ApiResponse.success(res, {
        section: currentSection,
    }, "Section updated successfully");
});
export const getAllSections = asyncHandler(async (req, res) => {
    const instructorId = req.userId;
    const courseId = req.params.courseId;
    const sections = await Section.find({
        courseId: new Types.ObjectId(courseId),
        isRemoved: false,
    }).sort({ order: 1 });
    ApiResponse.success(res, {
        sections,
    }, "Sections retrieved successfully");
});
export const getRemovedSections = asyncHandler(async (req, res) => {
    const instructorId = req.userId;
    const courseId = req.params.courseId;
    const sections = await Section.find({
        courseId: new Types.ObjectId(courseId),
        isRemoved: true,
    }).sort({ order: 1 });
    if (sections.length === 0) {
        throw AppError.notFound("No removed sections found for this course");
    }
    const existingCourse = await Course.findOne({ _id: courseId });
    if (existingCourse?.instructorId.toString() != instructorId) {
        throw AppError.unauthorized("You are not authorized to view removed sections of this course");
    }
    ApiResponse.success(res, {
        sections,
    }, "Removed sections retrieved successfully");
});
export const undoRemoveSection = asyncHandler(async (req, res) => {
    const sectionId = req.params.sectionId;
    const courseId = req.params.courseId;
    let existingSection;
    if (req.url.includes("/undoremoved")) {
        existingSection = await Section.findOne({
            _id: sectionId,
            isRemoved: true,
        });
    }
    else {
        existingSection = await Section.findOne({
            courseId: new Types.ObjectId(courseId),
            isRemoved: true,
        }).sort({ order: -1 });
    }
    if (!existingSection) {
        throw AppError.notFound("Section with this ID does not exist or is not removed");
    }
    await Section.updateOne({ _id: existingSection._id }, { isRemoved: false, order: existingSection.lastOrder, lastOrder: null });
    await Section.updateMany({
        _id: { $ne: existingSection._id },
        courseId: existingSection.courseId,
        order: { $gte: existingSection.lastOrder || 1 },
    }, { $inc: { order: 1 } });
    ApiResponse.success(res, {}, "Section restored successfully");
});
//# sourceMappingURL=sectionController.js.map