const nodemailer=require("nodemailer");
require("dotenv").config();
const mailSender=async(email,title,body)=>{
    try{
        console.log("ENTERED IN MAILSENDER API ->")
        const transportor=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            service:"gmail",
            auth:{
                user:"parthchauhan220@gmail.com",
                pass:"mhyi gnaz zmvn bghm"
            }
        })

        let info=await transportor.sendMail({
            from:"StudyNotion",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        return info;
    }catch(error){
        console.log(error.message);
    }
}

module.exports=mailSender;