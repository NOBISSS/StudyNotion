import { Category } from "../models/CategoryModel.js";
import { StatusCode, type Handler } from "../types.js";
export const createCategory: Handler = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });

    return res.status(StatusCode.Success).json({
      success: true,
      message: "Category created successfully",
      category: categoryDetails,
    });
  } catch (error) {
    return res.status(StatusCode.ServerError).json({
      success: false,
      message: "something went wrong while creating category",
      error,
    });
  }
};

export const getAllCategory: Handler = async (req, res) => {
  try {
    const getCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(StatusCode.Success).json({
      success: true,
      message: "All Category fetched successfully",
      category: getCategory,
    });
  } catch (error) {
    return res.status(StatusCode.ServerError).json({
      success: false,
      message: "something went wrong while fetching category",
      error,
    });
  }
};

export const categoryPageDetails: Handler = async (req, res) => { 
  try {
    const { categoryId } = req.params;
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    console.log(selectedCategory);
    //handle the case when category is not found
    if (!selectedCategory) {
      console.log("Category is not found");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    //handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected Category");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected Category",
      });
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

    res.status(StatusCode.Success).json({
      selectedCategory: selectedCourse,
      differenceCourses: differenceCourses,
      mostSellingCourses: mostSellingCourses,
    });
  } catch (error) {
    return res.status(StatusCode.ServerError).json({
      success: false,
      message: "Something went wrong our side",
      error,
    });
  }
};
