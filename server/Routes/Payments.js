const router=require("express").Router();

const {capturePayment,verfiySignature}=require("../Controller/Payments");
const {auth,isInstructor,isStudent,isAdmin}=require("../Middleware/auth");
router.post("/capturePayment",auth,isStudent,capturePayment);
router.post("/verfiySignature",verfiySignature);
module.exports=router;