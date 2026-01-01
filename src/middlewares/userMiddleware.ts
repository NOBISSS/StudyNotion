import { type NextFunction,type Request,type Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { StatusCode } from "../types.js";
export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;
    const decodedToken = jwt.verify(
      accessToken,
      <string>process.env.JWT_ACCESS_TOKEN_SECRET
    );
    if (!decodedToken) {
      res.status(StatusCode.Unauthorized).json({ message: "Unautorized" });
      return;
    }
    //@ts-ignore
    const user = await User.findById(decodedToken._id);
    if (!user) {
      res.status(StatusCode.Unauthorized).json({ message: "Unauthorized" });
      return;
    }
    req.userId = user._id;
    next();
  } catch (err: any) {
    res
      .status(StatusCode.Unauthorized)
      .json({ message: err.message || "Something went wrong from our side" });
    return;
  }
};

export const isStudent=async(req:Request,res:Response,next:NextFunction)=>{
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
export const isInstructor=async(req:Request,res:Response,next:NextFunction)=>{
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
export const isAdmin=async(req:Request,res:Response,next:NextFunction)=>{
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