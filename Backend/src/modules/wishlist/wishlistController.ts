import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import type { Handler } from "../../shared/types.js";
import Wishlist from "./wishlistModel.js";

export const getWishlist:Handler = asyncHandler(async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized. User ID is missing." });
    }
    const wishlist = await Wishlist.findOne({ userId }).populate({
        path: "courseIds",
        select: "title description price",
    }).populate({
        path: "bundleIds",
        select: "title description price",
    });
    res.status(200).json({ success: true, data: wishlist });

});