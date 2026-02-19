import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";
import { FaRegTired } from "react-icons/fa";

const {
    GET_ALL_COURSE_API,
    COURSE_CATEGORIES_API,
    COURSE_DETAILS_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    GET_ALL_INSTRUCTOR_COURSE_API,
    EDIT_COURSE_API,
    CREATE_COURSE_API
}=courseEndpoints;


export const editCourseDetails=async(data)=>{
    const toastId=toast.loading("Loading...");
    try{
        const response=await apiConnector("PUT",EDIT_COURSE_API,data);
        console.log("EDIT COURSE API RESPONSE:::",response);
        if(!response?.data?.success){
            throw new Error("Could Not UPDATE Course");
        }
        toast.success("Course UPDATED");
    }catch(error){
        console.log("UPDATED COURSE API ERROR...",error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
}

export const deleteCourse=async(data,token)=>{
    const toastId=toast.loading("Loading...");
    try{
        const response=await apiConnector("DELETE",DELETE_COURSE_API,data);
        console.log("DELETE COURSE API RESPONSE:::",response);
        if(!response?.data?.success){
            throw new Error("Could Not Delete Course");
        }
        toast.success("Course Deleted");
    }catch(error){
        console.log("DELETE COURSE API ERROR...",error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
}


export const fetchInstructorCourses=async(token)=>{
    let result=[];
    const toastId=toast.loading("Loading...");
    try{
        const response=await apiConnector("GET",GET_ALL_INSTRUCTOR_COURSE_API);
          if(!response?.data?.success){
            throw new Error("Could not fetch the courses of instructor");
        }
        result=response?.data?.data;
    }catch(error){
        console.log("ERROR OCCURED WHILE FETCHING ALL INSTRUCTOR COURSES::",error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
}

//get Full Details of a Course
export const getFullDetailsOfCourse=async(courseId,token)=>{
    const toastId=toast.loading("Loading...");
    let result=null;
    try{
        const response=await apiConnector("POST",GET_FULL_COURSE_DETAILS_AUTHENTICATED,{courseId});
        if(!response?.data?.success){
            throw new Error("Could not fetch the full details of course");
        }
        result=response?.data?.data;
    }catch(error){
        console.log("ERROR OCCURED WHILE GETTING FULL DETAILS OF COURSE::",error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
}

//FETCH ALL COURSE
export const getAllCourses=async()=>{
    const toastId=toast.loading("Loading...");
    let result=[];
    try{
        const response=await apiConnector("GET",GET_ALL_COURSE_API);
        if(!response?.data?.success){
            throw new Error("Could not fetch course");
        }
        result=response?.data?.data;
    }catch(error){
        console.log("ERROR OCCURED WHILE FETCHING ALL COURSES::",error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const fetchCourseDetails=async(courseId)=>{
    const toastId=toast.loading("Loading...");
    let result=null;
    try{
        const response=await apiConnector("GET",COURSE_DETAILS_API,{courseId});
        if(!response?.data?.success){
            throw new Error("Could not fetch the Course Details");
        }
        result=response?.data;
    }catch(error){
        console.log("ERROR OCCURED WHILE FETCHING COURSE DETAILS::",error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
}

//fetching the available course Categories
export const fetchCourseCategories=async()=>{
    
    let result=[];
    try{
        const response=await apiConnector("GET",COURSE_CATEGORIES_API);
        //console.log("COURSE CATEGORIES API RESPONSE::",response);
        if(!response?.data?.success){
            throw new Error("Could not fetch course Categories");
        }
        result=response?.data?.Category;
    }catch(error){
        console.log("ERROR OCCURED WHILE FETCHING ALL CATEGORIES::",error);
        toast.error(error.message);
    }
    return result;
}


//add the course Details

export const addCourseDetails=async(data,token)=>{
    let result=null;
    const toastId=toast.loading("Loading...");
    try{
        const response=await apiConnector("POST",CREATE_COURSE_API,data);
        console.log(response);
        if(!response?.data?.success){
            throw new Error("Could Not Add Course Details");
        }
        toast.success("COURSE DETAILS ADDED SUCCSSFULLY");
        result=response?.data
    }catch(error){
        console.log("ERROR OCCURED WHILE ADDING COURSE DETAILS:::",error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
}