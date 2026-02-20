const Profile = require("../Models/Profile");
const User = require("../Models/User");
const uploadFilesToCloudinary = require("../Utils/ImageUploader");

exports.updateProfile = async (req, res) => {
    try {
        //get data
        console.log(req.body)
        const { firstName, lastName } = req.body;
        const { dateOfBirth="A", about, contactNumber, gender="Male" } = req.body.additionalDetails;
        //get UserID
        const id = req.user.id;
        console.log("dob:", dateOfBirth, " about:", about, " cn:", contactNumber, " gender:", gender)
        //validation
        console.log("CURRENT DATE :",new Date());
        if(new Date(dateOfBirth) > new Date()){
            return res.status(400).json({
                success:false,
                message:"PLEASE ENTER VALID BIRTHDATE"
            })
        }

        if (!contactNumber || !gender) {
            return res.status(400).json({
                success: false,
                message: "ALL FIELDS ARE REQUIRED"
            })
        }

        const user = await User.findById(id);
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        await user.save();
        //find profile 
        // const UserDetails=await User.findById(id).populate("additionalDetails").exec();
        //console.log("USER DETAILS: ",UserDetails);
        const profileDetails = await Profile.findByIdAndUpdate(
            user.additionalDetails, {
            contactNumber,
            dateOfBirth,
            about,
            gender
        }, { new: true });
        //Update
        const updatedUser = await User.findById(id).populate("additionalDetails").exec();

        //profileDetails.contactNumber=contactNumber;
        //profileDetails.dateOfBirth="31-05-04";

        //profileDetails.about=about;
        //await profileDetails.save();
        //return response
        return res.status(200).json({
            success: true,
            message: "PROFILE UPDATED SUCCESSFULLY",
            user: updatedUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            err: error.err
        })
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        //get Id
        console.log("REQUEST BODY :", req.user.id);
        const id = req.user.id;
        const userDetails = await User.findById(id);
        //validate
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "USER NOT FOUND"
            })
        }
        //delete the profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
        //delete User 
        await User.findByIdAndDelete({ _id: id });
        //return response
        return res.status(200).json({
            success: true,
            message: "PROFILE DELETED SUCCESSFULLY"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR"
        })
    }

}

exports.getAllUserDetails = async (req, res) => {
    try {
        //GET ID
        const id = req.user.id;
        //FIND THE USER 
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        //console.log(userDetails);
        //return response
        return res.status(200).json({
            success: true,
            message: "USER DATA FETCHED SUCCESSFULLY",
            userDetails
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
        if (!req.files || !req.files.displayPicture) {
            return res.status(400).json({
                success: false,
                message: "No Profile Picture Uploaded"
            });
        }

        const picture = req.files.displayPicture;

        //Upload to Cloudinary
        const response = await uploadFilesToCloudinary(picture, "StudyNotionProfile")

        if (!response || !response.secure_url) {
            return res.status(500).json({
                success: false,
                message: "Failed to Upload picture to Cloudinary"
            });
        }
        //update user in DB
        const updateProfilePic = await User.findOneAndUpdate({ _id: req.user.id }, { image: response.secure_url }, { new: true })
        
        if (!updateProfilePic) {
            return res.status(404).json({
                success: false,
                message: "USER NOT FOUND"
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Picture updated successfully',
            user: updateProfilePic
        })

    } catch (error) {
        console.log("Error While Updating profile pic", error)
        return res.status(500).json({
            success: true,
            message: "Server error while updating profile picture"
        })
    }
}

exports.getEnrolledCourses = async (req, res) => { 
    try{
        const userId=req.user.id;
        const userDetails=await User.findOne({_id:userId})
        .populate("courses").exec();

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:`Could not found user with id:${userDetails}`,
            })
        }

        return res.status(200).json({
            success:true,
            data:userDetails.courses,
        })
    }catch(error){
        console.log("ERROR OCCURED WHILE FETCHING ENROLLED COURSES::",error);
        return res.status(500).josn({
            success:false,
            message:"ERROR OCCURED WHILE FETCHING ENROLLED COURSES::",
            error
        })
    }
 }


exports.removeUserFromEnrolledCourse=async(req,res)=>{
     try{
        const userId=req.user.id;
        const userDetails=await User.findOne({_id:userId})
        .populate("courses").exec();

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:`Could not found user with id:${userDetails}`,
            })
        }

        return res.status(200).json({
            success:true,
            data:userDetails.courses,
        })
    }catch(error){
        console.log("ERROR OCCURED WHILE FETCHING ENROLLED COURSES::",error);
        return res.status(500).josn({
            success:false,
            message:"ERROR OCCURED WHILE FETCHING ENROLLED COURSES::",
            error
        })
    }
}
/*
TO-DO:
REQUEST KO SCHEDULE KESE KARE 
LIKE USER KA ACCOUNT KO 5 DAYS BAD DELETE KARE IF USER WANT TO DELETE ACCOUNT

UNENROLL USER  FORM ALL ENROLLED COURSES
:REMOVE THAT USER FROM TOTAL ENROLLED NUMBER OF STD IN COURSE
EX. 100 STUDENTS ARE ENROLLED AND AFTER SOME TIME ONE OF THAT STUDENT DELETED HIS ACCOUNT NOW THE ENROLL COUNT MUST BE 99 FROM 100

EXPLORE :HOW CAN WE SCHEDULE THIS DELETION -----READ(CRONJOB)

PROCESS:
BEFORE DECREASING THE ENROLL DIRECTLY WE HAVE TO CHECK WHETHER THE STUDENT IS ENROLLED THAT COURSE OR NOT AND IN WHICH COURSES WE HAVE TO DECREASE WE HAVE TO FIND SO WE HAVE TO CHECK FIRST THAT WHETHER THE STUDENT IS ENROLLED ANY COURSE OR NOT AND IF ENROLLED HOW MANY COURSE AND WHICH COURSE HE HAD ENROLLED
*/
