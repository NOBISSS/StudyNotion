import React, { useEffect, useState } from 'react'
import { CTAButton } from '../../HomePage/Button';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../services/operations/courseDetailsAPI';
import ChipInput from './ChipInput';
import RequirementOfCourse from './RequirementOfCourse';
import { IconBtn } from '../../../common/IconBtn';
import toast from 'react-hot-toast';
import { setCourse,setStep } from '../../../../slices/courseSlice';
import {COURSE_STATUS} from "../../../../utils/constants";
const CourseInformationForm = () => {

    const{
      register,
      handleSubmit,
      setValue,
      getValues,
      formState:{errors}
    }=useForm();
    const dispatch=useDispatch();
    const {course,editCourse}=useSelector((state)=>state.course);
    const [loading,setLoading]=useState(false);
    const [courseCategories,setCourseCategories]=useState([])
    const {token}=useSelector((state)=>state.auth);
    useEffect(()=>{
      const getCategories=async()=>{
        setLoading(true);
        const categories=await fetchCourseCategories();
        
        if(categories.length > 0){
          setCourseCategories(categories);
        }
        setLoading(false);
      }    
      if(editCourse){
        setValue("courseTitle",course.courseName);
        setValue("courseShortDesc",course.courseDescription);
        setValue("coursePrice",course.price);
        setValue("courseTag",course.tag);
        setValue("courseWhatYouWillLearn",course.whatYouWillLearn);
        setValue("courseCategory",course.category);
        setValue("courseBenefits",course.benefits);
        setValue("courseRequirements",course.instructions);
        setValue("courseImage",course.thumbnail);
      }
      getCategories();  
    },[])
    const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    tags: "",
    thumbnail: null,
    benefits: "",
    requirements: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setCourseData({
      ...courseData,
      [name]: files ? files[0] : value,
    });
  };

  // const handleSubmitt = (e) => {
  //   e.preventDefault();
  //   console.log(courseData);
  //   // Later connect with API
  // };
  const isFormUpdated=()=>{
    const currentValues=getValues();
    if(currentValues.courseTitle!==course.courseName ||
      currentValues.courseShortDesc!==course.courseDescription ||
      currentValues.coursePrice!==course.price ||
      currentValues.courseBenefits!==course.whatYouWillLearn ||
      currentValues.courseCategory_id!==course.category._id ||
      currentValues.courseRequirements.toString()!==course.instruction.toString()) 
      return true
    else
      return false;
  }
  //handle next button click
  const onSubmit=async(data)=>{
    //DATA
    console.log("DATA GOT ON SUBMIT ",data)
    if(editCourse){
      if(isFormUpdated()){
         const currentValues=getValues()
      const formData=new FormData();
      formData.append("courseId",course._id);
      if(currentValues.courseTitle!==course.courseTitle){
        formData.append("courseName",data.courseTitle);
      }
      if(currentValues.courseShortDesc!==course.courseDescription){
        formData.append("courseDescription",data.courseShortDesc);
      }
      if(currentValues.coursePrice!==course.price){
        formData.append("price",data.coursePrice);
      }
      if(currentValues.courseBenefits!==course.whatYouWillLearn){
        formData.append("whatYouWillLearn",data.courseBenefits);
      }
      if(currentValues.courseCategory!==course.course.category._id){
        formData.append("category",data.courseCategory);
      }

      if(currentValues.courseRequirements.toString()!==course.course.instructions.toString()){
        formData.append("instructions",JSON.stringify(data.courseRequirements));
      }
      setLoading(true);
      const result=await editCourseDetails(formData,token);
      setLoading(false);
      if(result){
        setStep(2)
        dispatch(setCourse(result));
      }
      }else{
      toast.error("NO changes made to the form");
    }
      return;
    }
    //create new course
    const formData=new FormData();
    formData.append("courseName",data.courseTitle);
    formData.append("courseDescription",data.courseShortDesc);
    formData.append("price",data.coursePrice);
    formData.append("whatYouWillLearn",data.courseBenefits);
    formData.append("category",data.courseCategory);
    formData.append("instructions",JSON.stringify(data.courseRequirements));
    formData.append("thumbnailImage",data.courseImage[0])
    formData.append("tag",data.courseTag);
    
    formData.append("status",COURSE_STATUS.DRAFT);
    
    setLoading(true);
    console.log("ADD COURSE DETAILS FUNCTION IS CALLED");
    const result=await addCourseDetails(formData,token);
    console.log("RESULT OF WHEN WE CREATE COURSE::",result)
    if(result.success){
      dispatch(setStep(2))
      dispatch(setCourse(result));
    } 

    setLoading(false);

  }
  

  return (
    <div className="flex min-h-screen w-fit rounded-md bg-gray-900 text-white">
      {/* Main Content */}
      <main className="flex-1 p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-8">
          {/* Left Form */}
          <div className="col-span-2 space-y-6">
            <div>
              <label htmlFor='courseTitle' className="block mb-2 font-semibold">Course Title<sup>*</sup></label>
              <input
                id='courseTitle'
                type="text"
                name="title"
                {...register("courseTitle",{required:true})}
                onChange={handleChange}
                placeholder="Enter Course Title"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
              />
              {
                errors.courseTitle && (
                  <span>Course Title is Required**</span>
                )
              }
            </div>

            <div>
              <label htmlFor='courseShortDesc' className="block mb-2 font-semibold">Course Short Description *</label>
              <textarea
                id='courseShortDesc'
                name="description"
                
                {...register("courseShortDesc",{required:true})}
                onChange={handleChange}
                placeholder="Enter Description"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 h-24 focus:outline-none focus:border-yellow-400"
              />
               {
                errors.courseShortDesc && (
                  <span>Course Short Description is Required**</span>
                )
              }
            </div>

            <div>
              <label htmlFor='coursePrice' className="block mb-2 font-semibold">Course Price *</label>
              <input
                id='coursePrice'
                type="number"
                name="price"
                
                {...register("coursePrice",{
                  required:true,
                  valueAsNumber:true
                })}
                onChange={handleChange}
                placeholder="Enter Course Price"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
              />
              {/* <HiOutlineCurrencyRupee/> */}
               {
                errors.coursePrice && (
                  <span>Course Price is Required**</span>
                )
              }
            </div>

            <div>
              <label htmlFor='courseCategory' className="block mb-2 font-semibold">Course Category *</label>
              <select
                id='courseCategory'
                name="category"
                
                onChange={handleChange}
                //defaultValue=""
                {...register("courseCategory",{required:true})}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
              >
                <option value="" disabled>Choose a Category</option>
                {
                  !loading && courseCategories.map((category,index)=>(

                    <option key={index} value={category?._id}>{category?.name}</option>
                  ))
                }
                {/* <option value="webdev">Web Development</option>
                <option value="datasci">Data Science</option>
                <option value="design">Design</option> */}
              </select>
               {
                errors.courseCategory && (
                  <span>Course Category is Required**</span>
                )
              }
            </div>
            <ChipInput 
              label="Tags"
              name="courseTags"
              placeholder="Enter tags and press enter"
              register={register}
              errors={errors}
              setValue={setValue}
              //getValue={getValue}
              
            />
            {/* <div>
              <label className="block mb-2 font-semibold">Tags *</label>
              <input
                type="text"
                name="tags"
                value={courseData.tags}
                onChange={handleChange}
                placeholder="Enter Tags and press Enter"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
              />
            </div> */}

            <div className='thumbnail'>
              <label className="block mb-2 font-semibold">Course Thumbnail *</label>
              <input
                type="file"
                name="thumbnail"
                {...register("courseImage",{required:true})}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              />
              <p className="text-sm text-gray-400 mt-1">Recommended size: 1024×576</p>
            </div>

             <div>
              <label className="block mb-2 font-semibold">Benefits of the course</label>
              <textarea
                name="benefits"
                onChange={handleChange}
                {...register("courseBenefits",{required:true})}
                placeholder="Enter benfits of the course"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 h-24 focus:outline-none focus:border-yellow-400 resize-none"
                
              />
               {
                errors.courseBenefits && (
                  <span>Course Benefits is Required**</span>
                )
              }
            </div>
            <RequirementOfCourse 
            label="requirement"
              name="courseRequirements"
              placeholder="Enter Requiments and press enter"
              register={register}
              errors={errors}
              setValue={setValue}
              //getValue={getValue}
            />
            {/* <div>
              <label className="block mb-2 font-semibold">Requirements/Instructions *</label>
              <input
                type="text"
                name="tags"
                value={courseData.requirement}
                onChange={handleChange}
                placeholder="Enter Requirements/Instructions"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
              />
            </div> */}
            {
              editCourse && (
                <button
                className='px-4 py-2 bg-amber-300 text-black'
                onClick={()=>dispatch()}
                >
                  Continue Without Saving
                </button>
              )
            }
            <div className=''>
              <input type='submit'/>
            <IconBtn 
            text={!editCourse ? "Next" : "Save Changes"}
            iconName={"VscSave"}
            />
            </div>
    </div>
    </form>
    </main>
    </div>
  )
}

export default CourseInformationForm