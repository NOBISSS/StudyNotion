import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants.js";
import { createOrder, verifyPayment } from "./paymentController.js";
const paymentRouter = Router();
paymentRouter.use(userMiddleware);
paymentRouter.use(authorizeRoles(ROLES.STUDENT));
paymentRouter.post("/create-order", createOrder);
paymentRouter.post("/verify", verifyPayment);
export { paymentRouter };
//# sourceMappingURL=paymentRoutes.js.map