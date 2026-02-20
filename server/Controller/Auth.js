const User=require("../Models/User");
const Profile=require("../Models/Profile");
const OTP=require("../Models/OTP");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
//passwordUpdate
const mailSender=require("../Utils/MailSender");
require("dotenv").config();
//SEND OTP
exports.sendOTP=async(req,res)=>{
    try{
    //fetch email from request Body
    const {email}=req.body;

    //CHECK IF USER ALREADY EXIST
    const CheckUserPresent=await User.findOne({email});

    if(CheckUserPresent){
        return res.status(401).json({
                success:false,
                message:"USER ALREADY REGISTERD"
            })
    }

    var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    })

    console.log("OTP GENERATED: ",otp);

    //CHECK UNIQUE OTP OR NOT 
    let Result=await OTP.findOne({otp:otp});

    while(Result){
        otp=otpGenerator(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
        })

        Result=await OTP.findOne({otp:otp});
    }

    const otpPayload={email,otp};
    //CREATE AN ENTRY IN DB FOR OTP
    const otpBody=await OTP.create(otpPayload);
    //console.log(otpBody);
    res.status(200).json({
        success:true,
        message:"OTP SENT SUCCESSFULLY",
        otp:otp
    });


    }catch(error){
    console.log(error)
        res.status(500).json({
        success:false,
        message:error.message
    });
    }

};

//SIGN UP
exports.signUp=async(req,res)=>{
    try{
    //data fetch from request body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    }=req.body;
    //validation
    if(!firstName || !lastName || !password || !confirmPassword || !email || !otp){
        return res.status(403).json({
            success:false,
            message:"All fields are required"
        })
    }
    //match both password (password,confirm password)

    if(password!=confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and confirm password value doesn't match"
        })
    }
    //check user alredy exist or not ?
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false, 
            message:"User is Already Registerd.Please Sign in to continue"
        })
    }
    //find most recent OTP stored for the user
    const recentOtp=await OTP.find({email:email}).sort({createdAt:-1}).limit(1);

    //validate OTP
    if(recentOtp.length==0){
        //OTP NOT FOUND
        return res.status(400).json({
            success:false,
            message:"OTP NOT FOUND"
        })
    }else if(otp!==recentOtp[0].otp){
        return res.status(400).json({
            success:false,
            message:"THE OTP DOESN'T MATCH || INVALID OTP"
        })
    }

    //HASH PASSWORD
    const hashedPassword=await bcrypt.hash(password,10);

    //Create the User
    let apporved="";
    apporved==="Instructor" ? (apporved=false):(apporved=true);  

    //entery in DB and respones successful
    const profileDetails=await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    });

    const user=await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        additionalDetails:profileDetails._id,
        password:hashedPassword,
        accountType:accountType,
        approved:apporved,
        image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    return res.status(200).json({
            success:true,
            message:"USER REGISTERED SUCCESSFULLY",
            user:user
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
                success:false,
                message:"INTERNAL SERVER ERROR WHILE SIGNUP"
        })
    }
}


//LOGIN
exports.login=async (req,res)=>{
    try{
    //CHECK WHETHER USER EXIST OR NOT || get Data
    const {email,password}=req.body;
    //validate
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"ALL FIELD ARE REQUIRED PLEASE FILL THE DETAILS"
        })
    }
    //check exist or not
    const CheckUser=await User.findOne({email}).populate("additionalDetails");
    if(!CheckUser){
        return res.status(401).json({
            success:false,
            message:"USER HAS NOT REGISTERED PLEASE REGISTERED FIRST"
        })
    }

    
    if(await bcrypt.compare(password,CheckUser.password)){
    //generate JWT,after password match
        const payload={
            email:CheckUser.email,
            id:CheckUser._id,
            accountType:CheckUser.accountType
        } 
        const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h"
         });

         //CheckUser.token=token;
         CheckUser.password=undefined;

         //create Cookie
         const options={
            expires:new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true

         }
         res.cookie("token",token,options).status(200).json({
            success:true,
            message:"LOGGED IN SUCCESSFULLY",
            token,
            user:CheckUser
         })
        
    }else{
        return res.status(401).json({
            success:false,
            message:"Password is incorrect ❌"
        })
    }
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"ERROR OCCUE WHILE LOGIN PLEASE TRY AGAIN!"
        })
    }
}
//CHANGE PASSWORD
exports.changePassword=async(req,res)=>{
    try{
    console.log(req.body);
    //get Data//get OldPassword,NewPassword,ConfirmPassword
    const {oldPassword,confirmPassword,email}=req.body;
    //validation
    //check whether it is user or not 
    if(!oldPassword || !confirmPassword || !email){
        return res.status(403).json({
            success:false,
            message:"ALL FIELD MUST HAVE DATA"
        })
    }

    const user=await User.findOne({email:email});

    if(!user){
        return res.status(401).json({
            success:false,
            message:"PLEASE REGISTER FIRST"
        })
    }

    // if(!(newPassword===confirmPassword)){
    //     return res.status(401).json({
    //         success:false,
    //         messsage:"PASSWORD AND CONFIRM PASSWORD IS NOT MATCHED"
    //     })
    // }


    //update pwd in db
    if(await bcrypt.compare(oldPassword,user.password));
    const hashedPassword=await bcrypt.hash(confirmPassword,10)
    user.password = hashedPassword;
    await user.save();
    //send email - password updated
    
    await mailSender(email,"PASSWORD CHANGE","YOUR PASSWORD CHANGED SUCCESSFULLY ")
    
    //return response
    return res.status(200).json({
        success:true,
        message:"PASSWORD CHANGED SUCCESSFULLY"
    })
}catch(error){
    console.log("ERROR OCCURED WHILE CHANGING PASSWORD:",error);
    return res.status(500).json({
        success:true,
        message:"ERROR OCCURED WHILE CHANGING PASSWORD",
        error
    })
}
}