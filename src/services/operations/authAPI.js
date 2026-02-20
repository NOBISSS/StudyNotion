import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector";
import {setLoading,setToken} from '../../slices/authSlice';
//import {resetCart} from '../../slices/cartSlice';
import {setUser} from "../../slices/profileSlice";
import {endPoints,settingsEndPoints} from "../apis";
import { FaCreativeCommonsNcJp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { updateUserState } from "../../utils/updateUserState";

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
}=endPoints

const {
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    UPDATE_DISPLAY_PICTURE_API,
    DELETE_PROFILE_API
}=settingsEndPoints


export function sendOtp(email,navigate){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading..");
        dispatch(setLoading(true));
        try{
            const response=await apiConnector("POST",SENDOTP_API,{
                email,
                checkUserPresent:true
            })
            console.log("SENDOTP API RESPONSE............",response)
            console.log(response.data.success)
            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("OTP Sent Successfully");
            navigate("/verifyemail");
        }catch(error){
            console.log("SENDOTP API ERROR............",error);
            toast.error(error.response.data.message || "Could Not Send OTP");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function signUp(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate
){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response=await apiConnector("POST",SIGNUP_API,{
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp
            })

            console.log("SIGNUP API RESPONSE......",response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Signup Succssful");
            navigate("/login");
        }catch(error){
            console.log("SIGNUP API ERROR.......",error);
            toast.error("Signup Failed");
            navigate("/signup");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}


export function UpdatePersonalInfo(formData){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading");
        dispatch(setLoading(true));

        try{
            console.log(formData);
            const response=await apiConnector("PUT",UPDATE_PROFILE_API,formData)
            console.log("PROFILE UPDATE API RESPONSE........",response);
            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("PROFILE UPDATED SUCCESSFULLY");
            dispatch(updateUserState(response.data.user));
            // dispatch(setUser({...response.data.user}))
            // localStorage.setItem("user", JSON.stringify(response.data.user));
        }catch(error){
            console.log("ERROR OCCURED WHILE UPDATING PROFILE")
            console.log("ERROR :",error)
            toast.error(error.response.data.message);
            }
            dispatch(setLoading(false));
        toast.dismiss(toastId)
    }
}

export function login(email,password,navigate){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading");
        dispatch(setLoading(true));
        try{
            const response=await apiConnector("POST",LOGIN_API,{email,password})
            console.log("LOGIN API RESPONSE........",response);
            console.log("FALSE SUCCESS MESSAGE:",response.data.message);
            if(!response.data.success){throw new Error(response.data.message);}
            toast.success("Login Successful");
            dispatch(setToken(response.data.token));
            const userImage=response.data?.user?.image ? response.data.user.image : `https://api.dicebear.com/5.x/initals/svg?seed=${response.data.user?.firstName} ${response.data.user?.lastName}`;
            dispatch(setUser({...response.data.user,image:userImage}));
            localStorage.setItem("token",JSON.stringify(response.data.token));
            localStorage.setItem("user",JSON.stringify(response.data.user));
            navigate("/dashboard/my-profile");
        }catch(error){ console.log("Login API ERROR...........",error);toast.error(error.response.data.message);}
        dispatch(setLoading(false));
        toast.dismiss(toastId)
    }}

export function logout(navigate){
    return (dispatch)=>{
        dispatch(setToken(null));
        dispatch(setUser(null))
        //dispatch(resetCart());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged Out");
        navigate("/")
    }
}

export function getPasswordResetToken(email,setEmailSent){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const response=await apiConnector("POST",RESETPASSTOKEN_API,{email})
            console.log("GET PASSWORD RESET TOKEN....",response);
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("RESET EMAIL SENT");
            setEmailSent(true);
            
        }catch(error){
            console.log("RESET PASSWORD TOKEN ERROR...",error);
            toast.error("Failed to send email for resetting password");
        }
        dispatch(setLoading(false));
    }
}

export function ResetPassword(password,confirmPassword,token){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const response=await apiConnector("POST",RESETPASSWORD_API,{password,confirmPassword,token});
            console.log("RESET PASSWORD RESPONSE...",response);
            if(!response.data.success){
                toast.error("FAILED TO RESET PASSWORD");
                throw new Error(response.data.message);
            }
            toast.success("PASSWORD IS RESETTED SUCCESSFULLY");
        }catch(error){
            console.log("RESET PASSWORD ERROR OCCURRED....",error);
        }
        dispatch(setLoading(false))
    }
}

export function UpdatePassword(password,navigate){
    return async(dispatch)=>{
        const toastId=toast.loading("Updating Password");
        console.log(password);
        try{
            const response=await apiConnector("PUT",CHANGE_PASSWORD_API,password)
            if(!response.data.success) throw new Error(response.data.message);
            toast.success("Password Updated Successfully");
            navigate("/login");
            
        }catch(error){
            console.log("ERROR OCCURED WHILE UPDATING PASSWORD::",error);
            toast.error(error.message || "Failed to Update Password")
        }finally{
            toast.dismiss(toastId);
        }
    }
}


export function updateProfilePicture(displayPicture){
    
    return async(dispatch)=>{
        console.log(displayPicture);
        const formData = new FormData();
        formData.append("displayPicture", displayPicture);
        console.log("FORM DATA :",formData);
        const toastId=toast.loading("UPLOADING PROFILE PICTURE")
        try{
            const response=await apiConnector("PUT",UPDATE_DISPLAY_PICTURE_API,formData);
            console.log(response);
            if(!response.data.success) throw new Error(response.data.message);
            dispatch(setUser({...response.data.user}))
            localStorage.setItem("user", JSON.stringify(response.data.user));
            toast.success("PROFILE PHOTO UPDATED SUCCESSFULLY");
        }catch(error){
            console.log(error);
            toast.error(error.message || "Failed to Update Password")
        }finally{
            toast.dismiss(toastId);
        }
    }
}


export function deleteAccount(user){
    return async(dispatch)=>{
        const toastId=toast.loading("DELETING YOUR ACCOUNT");

        try{
            const response=await apiConnector("DELETE",DELETE_PROFILE_API,user._id);
            console.log(response);
            if(!response.data.success) throw new Error(response.data.message);
            toast.success("YOUR ACCOUNT IS DELETED SUCCSSFULLY");
        }catch(error){
            console.log("ERROR OCCURED WHILE DELETING PROFILE>>>>>>",error);
            toast.error(error.response.data.message || "REFRESH THE PAGE");
        }finally{
            toast.dismiss(toastId);
        }
    }
}