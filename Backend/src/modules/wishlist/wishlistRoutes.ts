import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "./wishlistController.js";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants.js";
const wishlistRouter = Router();

wishlistRouter.use(userMiddleware);
wishlistRouter.use(authorizeRoles(ROLES.STUDENT));
wishlistRouter.get("/get", getWishlist);
wishlistRouter.post("/add", addToWishlist);
wishlistRouter.delete("/remove/:courseId", removeFromWishlist);

export default wishlistRouter;