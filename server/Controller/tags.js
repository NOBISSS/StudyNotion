/*
this controller is in construction don't use this 


const Tags = require("../Models/Tags");
exports.createTag=async(req,res)=>{
    try{
        //get Data
        const {name,description}=req.body;
        //validation
        if(!name || !description){
            return res.status(403).json({
                success:false,
                message:"THE FIELD MUST HAVE SOME DATA"
            })
        }

        //create entry in db
        const tagDetails=await Tags.create({name:name,description:description})
        console.log(tagDetails)

        return res.status(200).json({
            success:true,
            message:"TAGS CREATED SUCCESSFULLY"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"ERROR OCCURED WHILE CREATING TAGS",
            err:error.err
        })

    }
}

exports.getAllTags=async(req,res)=>{
    try{
        const getTags=await Tags.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"ALL TAGS ARE FETCHED SUCCESSFULLY",
            tags:getTags
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"GOT ERROR WHILE FETCHING ALL TAGS"
        })
    }
}
*/