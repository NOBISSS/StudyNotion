import { Router } from "express";
import { isInstructor, userMiddleware, } from "../../shared/middlewares/userMiddleware.js";
import { changeSectionOrder, createSection, getAllSections, getRemovedSections, removeSection, undoRemoveSection, updateSection, } from "./sectionController.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants.js";
const sectionRouter = Router();
sectionRouter.use(userMiddleware);
sectionRouter.route("/getall/:courseId").get(getAllSections);
sectionRouter.use(authorizeRoles(ROLES.INSTRUCTOR));
sectionRouter.route("/create").post(createSection);
sectionRouter.route("/update/:sectionId").put(updateSection);
sectionRouter.route("/remove/:sectionId").delete(removeSection);
sectionRouter.route("/changeorder/:sectionId").put(changeSectionOrder);
sectionRouter.route("/removed/:courseId").get(getRemovedSections);
sectionRouter.route("/undoremoved/:sectionId").put(undoRemoveSection);
sectionRouter.route("/undolastremoved/:courseId").put(undoRemoveSection);
export { sectionRouter };
//# sourceMappingURL=sectionRoutes.js.map