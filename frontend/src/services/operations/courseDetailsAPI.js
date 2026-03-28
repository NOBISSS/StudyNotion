import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { courseEndpoints, SignatureEndpoints } from "../apis"

const {
  GET_ALL_COURSE_API,
  COURSE_CATEGORIES_API,
  COURSE_DETAILS_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  GET_ALL_INSTRUCTOR_COURSE_API,
  EDIT_COURSE_API,
  CREATE_COURSE_API,
  CREATE_COURSE_MULTER_API,
} = courseEndpoints

const {
    POST_SIGNATURE_CLOUDINARY_API
}=SignatureEndpoints;

export const editCourseDetails = async (data) => {
  const toastId = toast.loading("Updating course...")
  let result = null
  try {
    const response = await apiConnector("PUT", EDIT_COURSE_API, data)
    if (!response?.data?.success) throw new Error("Could not update course")
    toast.success("Course updated successfully")
    result = response.data.data || response.data
  } catch (error) {
    toast.error(error.message || "Failed to update course")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

export const deleteCourse = async (data) => {
  const toastId = toast.loading("Deleting course...")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data)
    if (!response?.data?.success) throw new Error("Could not delete course")
    toast.success("Course deleted")
  } catch (error) {
    toast.error(error.message || "Failed to delete course")
  } finally {
    toast.dismiss(toastId)
  }
}

// ✅ Fixed: was checking response?.data?.data?.success which is wrong
export const fetchInstructorCourses = async () => {
  let result = []
  const toastId = toast.loading("Loading courses...")
  try {
    const response = await apiConnector("GET", GET_ALL_INSTRUCTOR_COURSE_API)
    if (!response?.data?.success) throw new Error("Could not fetch instructor courses")
    result = response?.data?.data || []
  } catch (error) {
    toast.error(error.message || "Failed to fetch courses")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

export const getFullDetailsOfCourse = async (courseId) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector("POST", GET_FULL_COURSE_DETAILS_AUTHENTICATED, { courseId })
    if (!response?.data?.success) throw new Error("Could not fetch course details")
    result = response?.data?.data
    return result
  } catch (error) {
    toast.error(error.message || "Failed to fetch course details")
  } finally {
    toast.dismiss(toastId)
  }
}

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API)
    if (!response?.data?.success) throw new Error("Could not fetch courses")
    result = response?.data?.data || []
  } catch (error) {
    toast.error(error.message || "Failed to fetch courses")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector("GET", COURSE_DETAILS_API, { courseId })
    if (!response?.data?.success) throw new Error("Could not fetch course details")
    result = response?.data
  } catch (error) {
    toast.error(error.message || "Failed to fetch course details")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

export const fetchCourseCategories = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    result = response?.data?.data?.category || response?.data?.Category || []
  } catch (error) {
    toast.error(error.message || "Failed to fetch categories")
  }
  return result
}

export const UploadCourseThumbnail=async(thumbnailImage)=>{
  try {

    

    const result = await apiConnector("POST", POST_SIGNATURE_CLOUDINARY_API,thumbnailImage);
    console.log(result.data.data.cloudName);
    const response=await apiConnector("POST","https://api.cloudinary.com/v1_1/"+result.data.data.cloudName+"/image/upload",{...result.data.data,thumbnailImage,folder:"StudyNotion"});
    console.log("IMAGE UPLOAD RESPONSE",response);
    if(!response.data?.success) throw new Error("Could not Upload Thumbnail");
    return response.data || "Thumbnail Uploaded Successfully";
  } catch (error) {
    toast.error(error.message || "Failed to Upload Thumbnail on Cloudinary")
  }
}


export const addCourseDetails = async (data) => {
  let result = null
  const toastId = toast.loading("Creating course...")
  try {
    const response = await apiConnector("POST", CREATE_COURSE_MULTER_API, data)
    if (!response?.data?.success) throw new Error("Could not create course")
    toast.success("Course created successfully")
    result = response?.data
  } catch (error) {
    toast.error(error.message || "Failed to create course")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}