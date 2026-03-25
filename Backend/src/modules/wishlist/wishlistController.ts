import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import type { Handler } from "../../shared/types.js";
import Wishlist from "./wishlistModel.js";
import { RatingAndReview } from "../rating/RatingAndReview.js";

export const getWishlist: Handler = asyncHandler(async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw AppError.unauthorized("User ID is required to fetch wishlist");
  }
  const wishlist = await Wishlist.findOne({ userId }).populate({
    path: "courseIds",
    select:
      "courseName description originalPrice discountPrice thumbnailUrl typeOfCourse categoryId",
  });

  if (!wishlist) {
    ApiResponse.success(
      res,
      { wishlist: { userId, courseIds: [] } },
      "Wishlist fetched successfully",
    );
    return;
  }

  const wishlistWithCourseRatings = await Promise.all(
    wishlist.courseIds.map(async (course) => {
      // @ts-ignore
      const courseObj = course.toObject();

      const courseRatings = await RatingAndReview.find({
        courseId: course._id,
      }).populate("userId");

      const reviewCount = courseRatings.length;
      const averageRating =
        reviewCount > 0
          ? courseRatings.reduce((acc, review) => acc + review.rating, 0) /
            reviewCount
          : 0;

      return {
        ...courseObj,
        averageRating,
        reviewCount,
        ratings: courseRatings,
      };
    }),
  );

  // return {
  //   _id: wishlist._id,
  //   userId: wishlist.userId,
  //   courses: wishlistWithCourseRatings,
  // };
  ApiResponse.success(
    res,
    { wishlist: wishlistWithCourseRatings },
    "Wishlist fetched successfully",
  );
});
export const addToWishlist: Handler = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.body;
  if (!userId) {
    throw AppError.unauthorized("User ID is required to add to wishlist");
  }
  if (!courseId) {
    throw AppError.badRequest("Course ID is required to add to wishlist");
  }
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, courseIds: [courseId] });
  } else {
    if (wishlist.courseIds.includes(courseId)) {
      throw AppError.conflict("Course is already in wishlist");
    }
    wishlist.courseIds.push(courseId);
  }
  await wishlist.save();
  ApiResponse.success(
    res,
    { wishlist },
    "Course added to wishlist successfully",
  );
});
export const removeFromWishlist: Handler = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;
  if (!userId) {
    throw AppError.unauthorized("User ID is required to remove from wishlist");
  }
  if (!courseId) {
    throw AppError.badRequest("Course ID is required to remove from wishlist");
  }
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    throw AppError.notFound("Wishlist not found for user");
  }
  wishlist.courseIds = wishlist.courseIds.filter(
    (id) => id.toString() !== courseId.toString(),
  );
  await wishlist.save();
  ApiResponse.success(
    res,
    { wishlist },
    "Course removed from wishlist successfully",
  );
});
export const clearWishlist: Handler = asyncHandler(async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw AppError.unauthorized("User ID is required to clear wishlist");
  }
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    throw AppError.notFound("Wishlist not found for user");
  }
  wishlist.courseIds = [];
  await wishlist.save();
  ApiResponse.success(res, { wishlist }, "Wishlist cleared successfully");
});
