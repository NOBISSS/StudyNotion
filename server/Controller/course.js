const Course = require("../Models/Course");
const User = require("../Models/User");
const Tags = require("../Models/Tags");
const Category = require("../Models/Category");
const uploadImageToCloudinary = require("../Utils/ImageUploader");
//2 CONTROLLERS :1)CREATE COURSE 2)GET ALL COURSE
//TODO: MANAGE THUMBNAIL UPLOAD PROCESS IN UPDATE COURSE DATE.16-09-25
exports.updateCourse = async (req, res) => {
    try {
        const { courseId, courseName, courseDescription, whatYouWillLearn, price, tag, category } = req.body;
        const thumbnail = req.files.thumbnailImage;
        if (!courseId || !courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category) {
            return res.status(400).json({
                success: false,
                message: "ALL FIELDS ARE REQUIRED"
            })
        }
        const userID = req.user.id;
        const instructorDetails = await User.findById(userID);
        console.log("INSTRUCTION DETAILS", instructorDetails)
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "INSTRUCTOR NOT FOUND"
            })
        }
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category is NOT FOUND"
            })
        }

        //const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        const newCourse = await Course.findByIdAndUpdate({ courseId }, {
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category: categoryDetails._id,
            //thumbnail:thumbnailImage.secure_url,
        })
    } catch (error) {
        console.log("ERROR OCCURED WHILE UPDATING THE COURSE")
    }
}


exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag, category } = req.body;
        //get Thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category) {
            return res.status(400).json({
                success: false,
                message: "ALL FIELDS ARE REQUIRED",
                data: req.body
            })
        }

        const userID = req.user.id;
        const instructorDetails = await User.findById(userID);
        console.log("INSTRUCTION DETAILS", instructorDetails)
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "INSTRUCTOR NOT FOUND"
            })
        }

        //check given tag is valid or not 
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category is NOT FOUND"
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })


        //add the new course to the user schema
        await User.findByIdAndUpdate({ _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id
                }
            },
            {
                new: true
            }
        )

        //update the Category schema
        await Category.findByIdAndUpdate({ _id: categoryDetails._id },
            {
                $push: {
                    course: newCourse._id
                }
            },
            {
                new: true,
            }
        )
        return res.status(200).json({
            success: true,
            message: "NEW COURSE CREATED SUCCESSFULLY",
            course: newCourse
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "ERROR OCCUR WHILE CREATING COURSE"
        })
    }
}

exports.showAllCourse = async (req, res) => {
    try {

        const allCourse = await Course.find({}, {
            courseName: true,
            courseDescription: true,
            price: true,
            tag: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "ALL COURSES ARE FETCHED SUCCESSFULLY",
            course: allCourse
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR"
        })
    }
}

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
        //getId
        const { courseId } = req.body;
        //find Course Details
        const courseDetails = await Course.find(
            { _id: courseId })
            .populate(
                {
                    path: "instructor",
                    populate: {
                        path: "additionalDetails"
                    }
                },
            )
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        //validation
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`
            })
        }

        //return response
        return res.status(200).json({
            success: true,
            message: "Course Details fetched successfully",
            data: courseDetails
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





exports.dummyAPI = async (req, res) => {
    try {
        const { course_id, user_id } = req.body;
        //validate
        if (!course_id || !user_id) {
            return res.status(500).json({
                success: false,
                message: "ALL FIELDS ARE MANDATORY"
            })
        }

        //Verify Course id and user
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "UNAUTHORIZED PERSON"
            })
        }

        const course = await Course.findById(course_id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "COURSE IS NOT FOUND"
            })
        }

        if (user.courses.includes(course_id)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        user.courses.push(course_id);
        await user.save();

        res.status(200).json({
            success: true,
            message: "COURSE ADDED SUCCESSFULLY"
        })
    } catch (error) {
        console.log("ERROR OCCURED WHILE ENROLLING COURSE :::", error);
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR"
        })
    }
}