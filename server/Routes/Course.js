const router=require("express").Router();

const {
    createCourse,
    getCourseDetails,
    showAllCourse,
    updateCourse,
    dummyAPI,
}=require("../Controller/course");
const {
    createRating,
    getAllRating,
    getAverageRating
}=require("../Controller/ratingAndReview");

const {
    createCategory,
    categoryPageDetails,
    getAllCategory

}=require("../Controller/category");

const {
    createSection,
    deleteSection,
    updatedSection,
}=require("../Controller/section");

const {
    createSubSection,
    updatedSubSection,
    deleteSubSection//
}=require("../Controller/sub-section");
const { isInstructor, auth ,isAdmin,isStudent} = require("../Middleware/auth");

//************************************************************************************************************ */
//                                              Course
//************************************************************************************************************ */
//Course can only be created by Instructor
router.post("/createCourse",auth,isInstructor,createCourse);
//Add a section to a Course
router.post("/addSection",auth,isInstructor,createSection);
//update a section
router.post("/updateSection",auth,isInstructor,updatedSection);
//delete a section
router.post("/deleteSection",auth,isInstructor,deleteSection);
router.post("/updateSubSection",auth,isInstructor,updatedSubSection);
router.post("/deleteSubSection",auth,isInstructor,deleteSubSection);
router.post("/addSubSection",auth,isInstructor,createSubSection);
router.get("/getAllCourses",showAllCourse);
router.post("/getCourseDetails",getCourseDetails);
router.put("/editCourse",updateCourse)
//************************************************************************************************************ */
//                                              Category
//************************************************************************************************************ */
router.post("/createCategory",auth,isAdmin,createCategory);
router.get("/showAllCategories",getAllCategory);
router.post("/getCategoryPageDetails",categoryPageDetails);


//************************************************************************************************************ */
//                                              Rating and Reviews
//************************************************************************************************************ */
router.post("/createRating",auth,isStudent,createRating);
router.get("/getAverageRating",getAverageRating);
router.get("/getReviews",getAllRating);



//UI/UX TESTING PURPOSE DUMMY API'S
router.post("/dummyAPI",dummyAPI);
module.exports=router;