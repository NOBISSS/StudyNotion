const mongoose=require("mongoose");
const {Schema}=mongoose;
const CategorySchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
    },
    course:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
    ]
});

module.exports=mongoose.model("Category",CategorySchema);