import { Types } from "mongoose";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import type { Handler } from "../../shared/types.js";
import Wishlist from "./wishlistModel.js";

export const getWishlist: Handler = asyncHandler(async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    throw AppError.unauthorized("User ID is required to fetch wishlist");
  }
  const wishlist = await Wishlist.aggregate([
    // Match the user's wishlist
    { $match: { userId: new Types.ObjectId(userId) } },

    // Lookup course details
    {
      $lookup: {
        from: "courses",
        localField: "courseIds",
        foreignField: "_id",
        as: "courses",
        pipeline: [
          {
            $project: {
              courseName: 1,
              description: 1,
              originalPrice: 1,
              discountPrice: 1,
              thumbnailUrl: 1,
              typeOfCourse: 1,
              categoryId: 1,
            },
          },
        ],
      },
    },

    // Unwind courses to process each one individually
    { $unwind: { path: "$courses", preserveNullAndEmptyArrays: true } },

    // Lookup ratings for each course
    {
      $lookup: {
        from: "ratingandreviews",
        localField: "courses._id",
        foreignField: "courseId",
        as: "courseRatings",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userId",
            },
          },
          { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
        ],
      },
    },

    // Add averageRating and reviewCount to each course
    {
      $addFields: {
        "courses.reviewCount": { $size: "$courseRatings" },
        "courses.averageRating": {
          $cond: {
            if: { $gt: [{ $size: "$courseRatings" }, 0] },
            then: { $avg: "$courseRatings.rating" },
            else: 0,
          },
        },
        "courses.ratings": "$courseRatings",
      },
    },

    // Group back to reassemble wishlist with all courses
    {
      $group: {
        _id: "$_id",
        userId: { $first: "$userId" },
        courses: { $push: "$courses" },
      },
    },
  ]);
  if (!wishlist) {
    ApiResponse.success(
      res,
      { wishlist: { userId, courseIds: [] } },
      "Wishlist fetched successfully",
    );
    return;
  }
  ApiResponse.success(res, { wishlist }, "Wishlist fetched successfully");
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
