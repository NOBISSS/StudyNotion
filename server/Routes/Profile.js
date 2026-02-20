const router=require("express").Router();
const {auth}=require("../Middleware/auth");
const{
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
}=require("../Controller/Profile");

//********************************************************************************** */
//                                      PROFILE ROUTES
//********************************************************************************** */
//delete user account
router.delete("/deleteProfile",auth,deleteAccount);
router.put("/updateProfile",auth,updateProfile);
router.get("/getUserDetails",auth,getAllUserDetails);
//get Enrolled Course
router.get("/getEnrolledCourses",auth,getEnrolledCourses);
router.put("/updateDisplayPicture",auth,updateDisplayPicture);

module.exports=router;