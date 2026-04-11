// Backend/src/modules/payment/paymentRoutes.ts
import { Router }         from "express"
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js"
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js"
import { ROLES }          from "../../shared/constants.js"
import { createOrder, verifyPayment } from "./paymentController.js"

const paymentRouter = Router()

// Both routes require student auth
paymentRouter.use(userMiddleware)
paymentRouter.use(authorizeRoles(ROLES.STUDENT))

// POST /payment/create-order   → creates Razorpay order, returns orderId + keyId
paymentRouter.post("/create-order", createOrder)

// POST /payment/verify         → verifies signature, creates enrollment
paymentRouter.post("/verify", verifyPayment)

export { paymentRouter }