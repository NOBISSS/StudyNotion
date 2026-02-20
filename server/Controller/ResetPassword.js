const User=require("../Models/User");
const mailSender=require("../Utils/MailSender");
const bcrypt=require("bcrypt");
const crypto=require("crypto");
//resetPasswordToken
exports.resetPasswordToken=async(req,res)=>{
    try{
    //get email
    const email=req.body.email;
    //validate the email user exist or not 
    const user=await User.findOne({email});
    if(!user){
        return res.status(403).json({
            success:false,
            message:"USER IS NOT EXIST"
        })
    }

    //generate TOKEN
    const token=crypto.randomUUID();
    //update user  by adding token and expiring time
    const updateDetails=await User.findOneAndUpdate({email},{
        token:token,
        resetPasswordExpires:Date.now()+5*60*1000
    },{new:true})
    console.log("DETAILS ",updateDetails)
    //create URL
    const url=`http://localhost:5000/update-password/${token}`
    //send mail containing the url
    console.log("\nTHIS IS EMAIL :\n",email);
    await mailSender(email,"Password Reset Link",
        `Password Reset Link: ${url} .Please click this url to reset your password`
    )

    return res.status(200).json({
        success:true,
        message:"MAIL SENDED SUCCESSFULLY PLEASE CHECK YOU GMAIL",
        url
    })
    //RETURN RESPONSE 
}catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"SOMETHING WENT WRONG WHILE SENDING MAIL",
    })
}
    
}
//resetPassword
exports.resetPassword=async(req,res)=>{
    try{
        //data Fetch
    const {password,confirmPassword,token}=req.body;
    //validation
    if(password !==confirmPassword){
        return res.json({
            success:false,
            message:"Password is not matched"
        })
    }
    //get User Details from db using token
    
    const userDetails=await User.findOne({token});
    
    //if no entry -- invalid token
    
    if(!userDetails){
        return res.json({
            success:false,
            message:"TOKEN IS INVALID"
        });
    }
    //Token Time check
    if(!(userDetails.resetPasswordExpires > Date.now())){
        return res.status(403).json({
            success:false,
            message:"Token is Expired"
        })
    }
    //hash password
    const hashedPassword=await bcrypt.hash(password,10);
    //update password
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true});
    return res.status(200).json({
        success:true,
        message:"Password reset successfully"
    })
    }catch(error){
        console.log(error);
        return res.status(500).json({
        success:false,
        message:"FAILED WHILE RESETING THE PASSWORD"
    })  
    }
}