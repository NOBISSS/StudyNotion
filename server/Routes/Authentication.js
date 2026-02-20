const router=require("express").Router();
const {
    auth,
    isStudent,
    isInstructor
}=require("../Middleware/auth");

const {
    login,
    signUp,
    sendOTP,
    changePassword
}=require("../Controller/Auth");

const {
    resetPasswordToken,
    resetPassword
}=require("../Controller/ResetPassword");

//Route for Login,Signup, and Authentication

//************************************************************************************************************ */
//                                              Authetication Routes                
//************************************************************************************************************ */



//route for user signup
router.post("/signUp",signUp)

//route for user login
router.post("/login",login)

//route for sending Otp to the user's email
router.post("/sendotp",sendOTP)

//route for changing the passsword
router.put("/changepassword",auth,changePassword);

//************************************************************************************************************ */
//                                              Reset Password                
//************************************************************************************************************ */
router.post("/reset-password-token",resetPasswordToken)
router.post("/reset-password",resetPassword);
module.exports=router;