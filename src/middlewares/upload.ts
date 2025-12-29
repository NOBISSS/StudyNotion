const multer=require("multer");
const storage=multer.memoryStorage();

const fileFilter=(req:Request,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
            cb(null,true);
    }else{
        cb(new Error("Only Image files are Allowed"),false)
    }
};

const upload=multer({
    storage:storage,
    limits:{
        fileSize:5*1024*1024,
    },
    fileFilter:fileFilter,
})

module.exports=upload;