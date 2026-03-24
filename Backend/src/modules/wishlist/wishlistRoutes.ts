import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "./wishlistController.js";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";

const wishlistRouter = Router();

wishlistRouter.use(userMiddleware);
wishlistRouter.get("/get", getWishlist);
wishlistRouter.post("/add", addToWishlist);
wishlistRouter.delete("/remove/:courseId", removeFromWishlist);

export default wishlistRouter;