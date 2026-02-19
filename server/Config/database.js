const mongoose=require("mongoose");
require("dotenv").config();
exports.ConnectDB=()=>{
    mongoose.connect("mongodb://localhost:27017/StudyNotion",{})
    .then(()=>console.log("DATABASE CONNECTED"))
    .catch((error)=>{
        console.log("DATABASE FAILED TO CONNECT");
        console.log("Error :",error);
        process.exit(1);
    })
};