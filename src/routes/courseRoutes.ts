import { Router } from "express";
import { isInstructor, userMiddleware } from "../middlewares/userMiddleware.js";
import { createCourse, getAllCourse } from "../controllers/courseController.js";
import { upload } from "../middlewares/upload.js";

const courseRouter = Router();

courseRouter.use(userMiddleware);
courseRouter.route("/getall").get(getAllCourse);
courseRouter.use(isInstructor);
courseRouter.route("/create").post(upload.single("thumbnail"),createCourse);
// courseRouter.route("/delete/:id").delete();
// courseRouter.route("/getcourse/:id").get();
// courseRouter.route("/update/:id").post();


export { courseRouter };