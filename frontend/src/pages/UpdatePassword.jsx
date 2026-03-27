import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { ResetPassword } from '../services/operations/authAPI';
const UpdatePassword = () => {
    const location=useLocation();
    const dispatch=useDispatch();
    const [formData,setFormData]=useState({
        password:"",
        confirmPassword:""
    }
    );

    const {password,confirmPassword}=formData;
    const [showPassword,setShowPassword]=useState(false);
    const [confirmShowPassword,setConfirmShowPassword]=useState(false);
    const {loading} =useSelector((state)=>state.auth);
    const HandleOnChange=(e)=>{
        
        setFormData((prevData)=>(
            {
                ...prevData,
                [e.target.name] : e.target.value
            }
        ));
    }

    const HandleOnSubmit=async(e)=>{
        const token=location.pathname.split("/").at(-1);
        dispatch(ResetPassword(password,confirmPassword,token));
    }
  return (

    <div>
        {
            loading ? (
                <div>
                    Loading
                </div>

            ) : (
                <div className='text-white'>
                    <h1>Choose New Password</h1>
                    <p>Almost done.Enter new Password and youre all set.</p>
                    <form action={HandleOnSubmit}>
                <div className=''>
                <label htmlFor="createPassword">
                <span>Create Password <span className='text-red-500'>*</span></span><br></br>
                <input type={showPassword ? "text" : "password"} id='createPassword' name='password' placeholder='Enter Password'
                value={password}
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                onChange={HandleOnChange}
                />
                <span
                onClick={()=>setShowPassword(prev=>!prev)}
                >
                    {
                    showPassword ? <FaEyeSlash /> :<IoEye />
                    }
                    
                </span>
                </label>
                <label htmlFor="confirmPassword">
                <span>Confirm Password <span className='text-red-500'>*</span></span><br></br>
                <input type='text' id='confirmPassword' name='confirmPassword' placeholder='Confirm Password'
                value={confirmPassword}
                onChange={HandleOnChange}
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                />
                <span
                onClick={()=>setConfirmShowPassword(prev=>!prev)}
                >
                    {
                    confirmShowPassword ? <FaEyeSlash /> :<IoEye />
                    }
                    
                </span>
                </label>
                </div>
                <button type='submit'>Reset Password</button>
                    </form>
                <div>
                <Link to="/login">
                <p>Back to Login</p>
                </Link>
                </div>
                </div>
            )

        }
    </div>
  )
}

export default UpdatePassword