const Cloudinary=require("cloudinary").v2;

const uploadFilesToCloudinary=async(file,folder)=>{
    const options={folder}
    try{
        /*if(height){
            options.height=height;
        }
        if(quality){
            options.quality=quality;
        }
        */
        options.resource_type="auto";
        return await Cloudinary.uploader.upload(file.tempFilePath,options);
    }catch(error){
        console.log(error);
    }
}

module.exports=uploadFilesToCloudinary;