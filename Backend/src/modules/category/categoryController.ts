import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
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

  ApiResponse.created(res, {
    message: "Category created successfully",
    category: categoryDetails,
  });
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
  ApiResponse.success(res, {
    message: "Category updated successfully",
    category: categoryDetails,
  });
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
  ApiResponse.success(res, {
    message: "Category deleted successfully",
    category: categoryDetails,
  });
});
export const getAllCategory = asyncHandler(async (req, res) => {
  const getCategory = await Category.find(
    { isActive: true },
    { name: true, description: true },
  );
  ApiResponse.success(res, {
    message: "All Category fetched successfully",
    category: getCategory,
  });
});
export const categoryPageDetails = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const selectedCategory = await Category.findById(categoryId)
    .populate("courses")
    .exec();

  // console.log(selectedCategory);
  //handle the case when category is not found
  if (!selectedCategory) {
    // console.log("Category is not found");
    throw AppError.notFound("Category is not found");
  }
  //handle the case when there are no courses
  if (selectedCategory.courses.length === 0) {
    console.log("No courses found for the selected Category");
    throw AppError.notFound("No courses found for the selected Category");
  }

  const selectedCourse = selectedCategory.courses;

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
  console.log(allCourse);
  const mostSellingCourses = allCourse
    //   .sort((a, b) => b.sold - a.sold)
    .slice(0, 10);

  ApiResponse.success(res, {
    message: "Category page details fetched successfully",
    selectedCategory: selectedCourse,
    differenceCourses: differenceCourses,
    mostSellingCourses: mostSellingCourses,
  });
});
