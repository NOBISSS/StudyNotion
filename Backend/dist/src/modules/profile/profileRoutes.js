import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import { changePassword, deleteAccount, deleteProfile, getUser } from "./profileController.js";
const profileRouter = Router();
profileRouter.use(userMiddleware);
profileRouter.route("/changepassword").put(changePassword);
profileRouter.route("/getuser").get(getUser);
profileRouter.route("/deleteaccount").delete(deleteAccount);
profileRouter.route("/deleteprofile").delete(deleteProfile);
export default profileRouter;
//# sourceMappingURL=profileRoutes.js.map