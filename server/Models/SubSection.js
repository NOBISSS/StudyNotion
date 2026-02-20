const mongoose=require("mongoose");
const {Schema}=mongoose;

const subSectionSchema=new Schema({
    title:{
        type:String,
    },
    timeDuration:{
        type:String,
    },
    description:{
        type:String,
    },
    videoUrl:{
        type:String,
    }
});

module.exports=mongoose.model("SubSection",subSectionSchema)