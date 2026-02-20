const subSection=require("../Models/SubSection");
const Section=require("../Models/Section");
const uploadFilesToCloudinary = require("../Utils/ImageUploader");
const SubSection = require("../Models/SubSection");

require("dotenv").config();
exports.createSubSection=async (req,res)=>{
    try{
        //FETCH DATA FROM REQ BODY
        const {sectionId,title,timeDuration,description}=req.body;
        //EXTRACT FILE/VIDEO
        const video=req.files.video;
        //Validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:"ALL FIELDS ARE REQUIRED"
            })
        }
        //Upload Video to Cloudinary
        const uploadDetails=await uploadFilesToCloudinary(video,process.env.FOLDER_NAME);
        //create a sub section
        const SubSectionDetails=await subSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        //update section with this sub section objectOID
        const updateSubSection=await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                subSection:SubSectionDetails._id
            }
        },{new:true})//LOG UPDATED SECTION AFTER POPULATING QUERY
        //Return response
        return res.status(200).json({
            success:true,
            message:"SUBSECTION CREATED SUCCESSFULLY"
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        })
    }
}

exports.updatedSubSection=async(req,res)=>{
    try{
        //get Data
        const {sectionId,title,timeDuration,description}=req.body;
        //EXTRACT FILE/VIDEO
        const video=req.files.videoFile;
        //Validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:"ALL FIELDS ARE REQUIRED"
            })
        }
        //update data
        const UpdateSubSection=await subSection.find({
            title:title,
            timeDuration:timeDuration,
            description:description,
            video:video
        });


        
        //return response
        return res.status(200).json({
            success:true,
            message:"SUB SECTION UPDATED SUCCESSFULLY"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        })
    } 
}


//UNDER CONSTRUCTION 
exports.deleteSubSection=async(req,res)=>{
    console.log("DELETE SUB SECTION WORK HAVE TO CREATE YET")
}

/*
OPINIONS:
WHEN  THIS SUB-SECTION'S ARE UPDATED WE SHOULD ALSO CHECK THE ACCOUNTTYPE OF USER
THAT MODIFICATION IS DONE BY THE INSTRUCTOR ONLY 
*/