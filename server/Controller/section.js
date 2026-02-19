const Course=require("../Models/Course");
const Section=require("../Models/Section");

exports.createSection=async (req,res)=>{
    try{
        //fetch data
        const {sectionName,courseId}=req.body;
        console.log("COURSEID: ",courseId);
        //courseId=courseId;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"ALL FIELDS ARE REQUIRED"
            })
        }

        //create section
        const newSection=await Section.create({sectionName});
        //insert section _id into course courseContent 
        const UpdateCourse=await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent:newSection._id,
            }
        },
        {new:true}
    ).populate({
        path:"courseContent",
        populate:{
            path:"subSection"
        },
    }).exec()
    //USE POPULATE TO REPLACE SECTION/SUB-SECTION BOTH IN THE UpdatedCourseDetails

        return res.status(200).json({
            success:true,
            message:"SECTION CREATED SUCCESSFULLY"
        })

    }catch(error){
        console.log(error);
    }
}

exports.updatedSection=async (req,res)=>{
    try{
        //data input
        const {sectionName,sectionId}=req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties"
            })
        }
        //update data
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName});
        //success
        return res.status(200).json({
            success:true,   
            message:"SECTION NAME IS UPDATED"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"INTERNAL SERVER ERROR",
            err:error.err
        })
    }
}

exports.deleteSection=async(req,res)=>{
    try{
        //get SectionID
        const {sectionId,courseId}=req.body;
        //validate that section is in course or not
        console.log(sectionId)
        const findSection=await Section.findById(sectionId);
        if(!findSection){
            return res.status(404).json({
                success:false,
                message:"THE PARTICULAR SECTION IS NOT FOUND, MAY IT IS ALREADY DELETE PLEASE REFRESH"
            })
        }
        //delete - findByIdandDelete
        //this is deleting whole course
        //await Course.findOneAndDelete({_id:courseId},{courseContent:sectionId});
        await Section.findByIdAndDelete(sectionId);
        return res.status(200).json({
            success:true,
            message:"SECTION DELETED SUCCESSFULLY"
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"INTERNAL SERVER ERROR",
            err:error.err
        })
    }

}