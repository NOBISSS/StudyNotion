import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";

import { changePassword, deleteAccount, getUser } from "./profileController.js";
const profileRouter = Router();

profileRouter.use(userMiddleware);

profileRouter.route("/changepassword").put(changePassword);
profileRouter.route("/getuser").get(getUser);
profileRouter.route("/deleteaccount").delete(deleteAccount);

export default profileRouter;
