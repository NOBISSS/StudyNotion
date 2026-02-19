const RatingAndReview=require("../Models/RatingAndReview");
const Course=require("../Models/Course");
//creating rating
exports.createRating=async(req,res)=>{
    try{
        
        //get user id
        const userId=req.user.id;
        //fetch data from req body
        const {rating,review,courseId}=req.body;
        //check user is enrolled or not
        const courseDetails=await Course.findOne(
            {_id:courseId,studentsEnrolled:{$elemMatch:{$eq:userId}}},
        
        )

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"STUDENT IS NOT ENROLLED IN THE COURSE"
            })
        }
        
        //check if user already reviewd the course
        const alreadyReviewed=await RatingAndReview.findOne({user:userId,
                                                    course:courseId
                                                    })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is already reviewed by the User"
            })
        }
        
        //create rating and review
        const ratingReview=await RatingAndReview.create({
            rating,
            review,
            course:courseId,
            user:userId
        })

        //update course with this rating/reviews
        const UpdateCourseDetails=await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                ratingAndReviews:ratingReview._id,
            }
        },{new:true})
        console.log(UpdateCourseDetails);
        return res.status(200).json({
            success:true,
            message:"RATING AND REVIEW IS CREATED SUCCESSFULLY"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        })
    }  
}

//getAverageRating
exports.getAverageRating=async(req,res)=>{
    try{
    //getcourse Id
    const courseId=req.body.courseId;
    //calculate avg rating
    const result=await RatingAndReview.aggregate([
        {
        $match:{
            course:new mongoose.Types.ObjectId(courseId),//COURSE ID IS NEED TO CONVERT INTO OBJECT ID AS IT COME AS STRING
        }
        },
        {
            $group:{
                _id:null,
                averageRating:{$avg:"$rating"}
            }
        }
    ])
    if(result.length>0){
        return res.status(200).json({
            success:true,
            averageRating:result[0].averageRating
        })
    }
    return res.status(200).json({
        success:true,
        message:"Average rating is 0,no rating given till now",
        averageRating:0
    })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        })
    }
}

//getAllReviewsandReviews
exports.getAllRating=async(req,res)=>{
    try{
        const allReviews=await RatingAndReview.find({})
        .sort({rating:"desc"})
        .populate({
            path:"User",
            select:"firstName lastName email image"
        }).populate({
            path:"Course",
            select:"courseName"
        }).exec();
        return res.status(200).json({
            success:true,
            message:"All reviews fetched succssfully",
            data:allReviews
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"INTERNAL SERVER ERROR"
        })
    }
}
/*
GET ONLY COURSE RELATED REVIEWS
*/


/*
DELETE THE REVIEW

*/
