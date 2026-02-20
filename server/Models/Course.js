const mongoose=require("mongoose");
const {Schema}=mongoose;

const courseSchema=new Schema({
    courseName:{
        type:String,
        trim:true,
        required:true
    },

    courseDescription:{
        type:String,
        trim:true,
    },

    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    whatYouWillLearn:{
        type:String,
        trim:true,
    },

    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],

    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],

    price:{
        type:Number,
    },

    thumbnail:{
        type:String
    },

    tag:{
        type:[String],
        required:true
    },

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },

    approved:{
        type:Boolean
    },

    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        }
    ],
    instructions:{
        type:[String]
    },
    status:{
        type:String,
        enum:["Draft","Published"],
        default:"Draft"
    }
})

module.exports=mongoose.model("Course",courseSchema);