const OtpTemplate=require("../mail/templates/OtpTemplate");
const mongoose=require("mongoose");
const mailSender = require("../Utils/MailSender");
const {Schema}=mongoose;

const OTPSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,

    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60, 
    }
});

//a function ->To send Email
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse=await mailSender(email,"VERIFICATION EMAIL FROM STUDYNOTION",`${OtpTemplate(otp)}`);
        console.log("Email Sent Successfully: ",mailResponse);

    }catch(error){
        console.log("Error Occured while Sending Mailes ",error.message)
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})


module.exports=mongoose.model("OTP",OTPSchema);