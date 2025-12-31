const Category = require("../Models/Category");
exports.createCategory=async(req:Request,res:Response)=>{
    try{
        //get Data
        const {name,description}=req.body;
        //validation
        if(!name || !description){
            return res.status(403).json({
                success:false,
                message:"THE FIELD MUST HAVE SOME DATA"
            })
        }

        //create entry in db
        const categoryDetails=await Category.create({name:name,description:description})
        console.log(categoryDetails)

        return res.status(200).json({
            success:true,
            message:"Category CREATED SUCCESSFULLY"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"ERROR OCCURED WHILE CREATING Category",
            err:error.err
        })

    }
}

exports.getAllCategory=async(req:Request,res:Response)=>{
    try{
        const getCategory=await Category.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"ALL Category ARE FETCHED SUCCESSFULLY",
            Category:getCategory
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"GOT ERROR WHILE FETCHING ALL Category"
        })
    }
}

exports.categoryPageDetails=async(req:Request,res:Response)=>{
    try{
        const {categoryId}=req.body;
        //get Courses for the specified Category
        const selectedCategory=await Category.findById(categoryId).populate("course").exec();

        console.log(selectedCategory)
        //handle the case when category is not found
        if(!selectedCategory){
            console.log("Category is not found");
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        }
        //handle the case when there are no courses
        if(selectedCategory.course.length===0){
            console.log("No courses found for the selected Category");
            return res.status(404).json({
                success:false,
                message:"No courses found for the selected Category"
            })
        }

        const selectedCourse=selectedCategory.course;

        //get courses for other categories
        const categoriesExceptSelected=await Category.find({_id:{$ne:categoryId
        },}).populate("course");

        let differenceCourses=[];
        for(const category of categoriesExceptSelected){
            differenceCourses.push(...category.course);
        }

        //get Top-selling courses across all categories
        const allCategories=await Category.find().populate("course");
        const allCourse=allCategories.flatMap((category)=>category.courses);
        const mostSellingCourses=allCourse.sort((a,b)=>b.sold - a.sold).slice(0,10);

        res.status(200).json({
            selectedCategory:selectedCategory,
            differenceCourses:differenceCourses,
            mostSellingCourses:mostSellingCourses
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"INTERNAL SERVER ERROR",
            error:error.message
        })
    }
}