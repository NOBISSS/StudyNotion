import toast from "react-hot-toast";
import { setLoading } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import { logout } from "./authAPI";

const {GET_USER_DETAILS_API,GET_USER_ENROLLED_COURSE_API}=profileEndpoints;

export async function getUserEnrolledCourses(token){
    const toastId=toast.loading("Loading....");
    let result=[];
    try{
        const response=await apiConnector("GET",
            GET_USER_ENROLLED_COURSE_API,
            null,
        )
        console.log("GET_USER_ENROLLED_COURSES_API RESPONSE>>>>>>>>>",response);
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        result=response.data.data;
        return result;
    }catch(error){
        console.log("ERROR ",error);
        toast.error(error.response.data.message || "PLEASE REFRESH THE PAGE");
    }finally{
        toast.dismiss(toastId);
    }
    return result;
}