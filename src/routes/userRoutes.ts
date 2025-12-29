const router=require("express").Router();
const upload=require("../middlewares/upload");
router.post("/signup",upload.single("photo"));
router.post("/login");
router.post("/password");
router.post("/logout");
