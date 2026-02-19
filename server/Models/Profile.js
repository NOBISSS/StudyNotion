const mongoose=require("mongoose");
const {Schema,Model}=mongoose;

const profileSchema=new Schema({
    gender:{
        type:String,
        enum:["Male","Female","Non-Binary","Prefer not to say","Other"]
    },
    dateOfBirth:{
        type:Date,
        required:false,
        validate: {
            validator: function (value) {
            // Ensure the date is not greater than today's date
            return value <= new Date();
            },
        message: "Date of birth cannot be in the future"
    }
    },
    about:{
        type:String,
        trim:true
    },
    contactNumber:{
        type:Number,
        trim:true
    }
});

module.exports=mongoose.model("Profile",profileSchema)