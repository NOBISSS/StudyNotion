import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { Course } from "../course/CourseModel.js";
import { Category } from "./CategoryModel.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    throw AppError.badRequest("All fields are required");
  }

  const categoryDetails = await Category.create({
    name: name,
    description: description,
  });

  ApiResponse.created(
    res,
    { category: categoryDetails },
    "Category created successfully",
  );
});
export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;
  if (!name || !description || !categoryId) {
    throw AppError.badRequest("All fields are required");
  }

  const categoryDetails = await Category.findByIdAndUpdate(
    categoryId,
    {
      name: name,
      description: description,
    },
    { new: true },
  );
  if (!categoryDetails) {
    throw AppError.notFound("Category not found");
  }
  ApiResponse.success(
    res,
    {
      category: categoryDetails,
    },
    "Category updated successfully",
  );
});
export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    throw AppError.badRequest("All fields are required");
  }

  const categoryDetails = await Category.findByIdAndUpdate(
    categoryId,
    { isActive: false },
    { new: true },
  );
  if (!categoryDetails) {
    throw AppError.notFound("Category not found");
  }
  const generateCategory = await Category.findOne({name: "Uncategorized"});

  if(!generateCategory){
    throw AppError.internal("Something went wrong from our end. Please try again later.");
  }
  await Course.updateMany(
    { categoryId: categoryId },
    { $set: { categoryId: generateCategory._id } }
  );
  generateCategory.courses.push(...categoryDetails.courses);
  await generateCategory.save();
  ApiResponse.success(
    res,
    {
      category: categoryDetails,
    },
    "Category deleted successfully",
  );
});
export const getAllCategory = asyncHandler(async (req, res) => {
  const getCategory = await Category.find(
    { isActive: true },
    { name: true, description: true },
  );
  ApiResponse.success(
    res,
    {
      category: getCategory,
    },
    "All Category fetched successfully",
  );
});
export const categoryPageDetails = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const selectedCategory = await Category.findById(categoryId)
    .populate("courses")
    .exec();

  if (!selectedCategory) {
    throw AppError.notFound("Category is not found");
  }

  //get courses for other categories
  const categoriesExceptSelected = await Category.find({
    _id: { $ne: categoryId },
  }).populate("courses");

  let differenceCourses = [];
  for (const category of categoriesExceptSelected) {
    differenceCourses.push(...category.courses);
  }

  //get Top-selling courses across all categories
  const allCategories = await Category.find().populate("courses");
  const allCourse = allCategories.flatMap((category) => category.courses);
  const mostSellingCourses = allCourse
    //   .sort((a, b) => b.sold - a.sold)
    .slice(0, 10);

  const selectedCourse = selectedCategory.courses;

  ApiResponse.success(
    res,
    {
      selectedCategory: selectedCourse.length > 0 ? selectedCourse : [],
      differenceCourses: differenceCourses,
      mostSellingCourses: mostSellingCourses,
      category: {
        _id: selectedCategory._id,
        name: selectedCategory.name,
        description: selectedCategory.description,
      },
    },
    "Category page details fetched successfully",
  );
});
