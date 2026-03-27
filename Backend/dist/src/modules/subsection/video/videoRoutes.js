import { Router } from "express";
import { getVideo, saveVideoProgress } from "./videoController.js";
const videoRouter = Router();
videoRouter.route("/getone/:subsectionId").get(getVideo);
videoRouter.route("/saveprogress").post(saveVideoProgress);
export default videoRouter;
//# sourceMappingURL=videoRoutes.js.map