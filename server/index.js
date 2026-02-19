const express=require("express");
const app=express();
const ConnectDB=require("./Config/database");
const cookieParser = require("cookie-parser");
const cors=require("cors");
const cloudinaryConnect=require("./Config/cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv"); 
dotenv.config();
//ROUTES
const userRoutes=require("./Routes/Authentication");
const profileRoutes=require("./Routes/Profile");
const paymentRoutes=require("./Routes/Payments");
const courseRoutes=require("./Routes/Course");
const PORT=process.env.PORT || 4000;

//Database Connect
ConnectDB.ConnectDB();

app.use(cookieParser());
app.use(express.json());


//entertain request from frontend
app.use(
    cors({
        origin:"http://localhost:5000",
        credentials:true
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/temp"
    })
)

//clodinary connection
cloudinaryConnect();

//ROUTES
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);

//def route
app.get("/",(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"YOUR SERVER IS UP"
    })
})

app.listen(PORT,(req,res)=>{
    console.log("SERVER IS STARTED AT 3000");
})