import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { courseEndpoints, sectionEndpoints, SignatureEndpoints, subSectionVideoEndpoints } from "../apis"

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
  PUT_PUBLISH_COURSE_API,
  PUT_DRAFT_COURSE_API,
  INSTRUCTOR_COURSE_DETAILS_API,
} = courseEndpoints;

const {
  GET_SECTION_API,
  CREATE_SECTION_API,
  DELETE_SECTION_API,
} = sectionEndpoints;


const {GET_SUBSECTION_API,DELETE_SUBSECTION_API} = subSectionVideoEndpoints;
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
    const response = await apiConnector("DELETE", DELETE_COURSE_API.replace(":courseId", data.courseId), data)
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
    const response = await apiConnector("GET", COURSE_DETAILS_API+"/"+courseId, { courseId })
    if (!response?.data?.success) throw new Error("Could not fetch course details")
    result = response?.data
  } catch (error) {
    toast.error(error.message || "Failed to fetch course details")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}
export const fetchInstructorCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector("GET", INSTRUCTOR_COURSE_DETAILS_API.replace(":courseId", courseId))
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

export const fetchCourseSections = async (data) =>{
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_SECTION_API.replace(":courseId", data.courseId));
    if (!response?.data?.success) throw new Error("Could not fetch sections");
    result = response?.data?.data || [];
  } catch (error) {
    toast.error(error.message || "Failed to fetch sections");
  } finally {
    toast.dismiss(toastId);
  }
  return result;
}

export const createSection = async (data) => {
  let result = null
  const toastId = toast.loading("Creating section...")
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data)
    if (!response?.data?.success) throw new Error("Could not create section")
    toast.success("Section created successfully")
    result = response?.data.data
    return result;
  } catch (error) {
    toast.error(error.message || "Failed to create section")
  } finally {
    toast.dismiss(toastId)
  }
}
export const deleteSection = async (data) => {
  const toastId = toast.loading("Deleting section...")
  try {
    const response = await apiConnector("DELETE", DELETE_SECTION_API.replace(":sectionId", data.sectionId));
    if (!response?.data?.success) throw new Error("Could not delete section");
    toast.success("Section deleted");
  } catch (error) {
    toast.error(error.message || "Failed to delete section");
  } finally {
    toast.dismiss(toastId);
  }
}
export const publishCourse = async (courseId) => {
  const toastId = toast.loading("Publishing course...")
  try {
    const response = await apiConnector("PUT", PUT_PUBLISH_COURSE_API.replace(":courseId", courseId));
    if (!response?.data?.success) throw new Error("Could not publish course");
    toast.success("Course published");
    return response?.data?.data.course;
  } catch (error) {
    toast.error(error.message || "Failed to publish course");
  }
  finally {
    toast.dismiss(toastId);
  }
}
export const draftCourse = async (courseId) => {
  const toastId = toast.loading("Drafting course...")
  try {
    const response = await apiConnector("PUT", PUT_DRAFT_COURSE_API.replace(":courseId", courseId));
    if (!response?.data?.success) throw new Error("Could not draft course");
    toast.success("Course drafted");
    return response?.data?.data.course;
  } catch (error) {
    toast.error(error.message || "Failed to draft course");
  }
  finally {
    toast.dismiss(toastId);
  }
}
export const getAllSubsections = async (sectionId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", subSectionVideoEndpoints.GET_SUBSECTION_API.replace(":sectionId", sectionId));
    if (!response?.data?.success) throw new Error("Could not fetch subsections");
    result = response?.data?.data || [];
    return result;
  } catch (error) {
    toast.error(error.message || "Failed to fetch subsections");
  } finally {
    toast.dismiss(toastId);
  }
}
export const removeSubsection = async (subsectionId) => {
  const toastId = toast.loading("Deleting subsection...");
  let result = [];
  try {
    const response = await apiConnector("DELETE", DELETE_SUBSECTION_API.replace(":subsectionId", subsectionId));
    if (!response?.data?.success) throw new Error("Could not delete subsection");
    result = response?.data?.data || [];
    return result;
  } catch (error) {
    toast.error(error.message || "Failed to delete subsection");
  } finally {
    toast.dismiss(toastId);
  }
}