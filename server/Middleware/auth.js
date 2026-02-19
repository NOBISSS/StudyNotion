const jwt=require("jsonwebtoken");
const User = require("../Models/User");
require("dotenv").config();
//AUTH
exports.auth=async(req,res,next)=>{
    try{
        //extract code
        const token=req.cookies?.token || req?.body?.token || req.header("Authorization").replace("Bearer ","");
        console.log(token);
        if(!token){
            return res.status(401).json({
                success:false,
                message:"TOKEN INVALID"
            })
        }

        //verify token
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }catch(error){
            //verfication failed or issued
            console.log(error)
            return res.status(401).json({
                success:false,
                message:"Verification Failed "
            })
        }   
        next();
    }catch(error){
        console.log(error)
        return res.status(401).json({
                success:false,
                message:"SOMETHING WENT WRONG WHILE VALIDATING THE TOKEN"
            })
    }
}

//STUDENT
exports.isStudent=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"THIS IS PROTECTED ROUTE"
            })
        }
        next();
    }catch(error){
         console.log(error)
        return res.status(401).json({
                success:false,
                message:"SOMETHING WENT WRONG WHILE VALIDATING THE TOKEN"
            })
    }
}

//INSTRUCTOR
exports.isInstructor=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"THIS IS PROTECTED ROUTE"
            })
        }
        next();
    }catch(error){
        console.log(error)
        return res.status(401).json({
                success:false,
                message:"SOMETHING WENT WRONG WHILE VALIDATING THE TOKEN"
            })
    }
}

//ADMIN
exports.isAdmin=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"THIS IS PROTECTED ROUTE"
            })
        }
        next();
    }catch(error){
        console.log(error)
        return res.status(401).json({
                success:false,
                message:"SOMETHING WENT WRONG WHILE VALIDATING THE TOKEN"
            })
    }
}