import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import {getPasswordResetToken} from "../services/operations/authAPI";
const ForgotPassword = () => {
    const [emailSent,setEmailSent]=useState(false);
    const {loading}=useSelector((state)=> state.auth);
    const [email,setEmail]=useState("");
    const dispatch=useDispatch();
    const HandleOnSubmit=(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent))
    }
  return (
    <div className='flex items-center justify-center text-white'>
        {
            loading ? (
                <div>Loading...</div>
            ) 
            : (
            
        <div className='flex flex-col items-center justify-center'>
            <h1>{
                !emailSent ? "Reset Your Password" : "Check Your Email"}</h1>
            <p>
                {
                !emailSent ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recover" : `We have sent the reset email to ${email}`}
            </p>
            <form onSubmit={HandleOnSubmit}>
                {
                    !emailSent && (
                        <label htmlFor="Email">
                <span>Email Address <span className='text-red-500'>*</span></span><br></br>
                <input type='text' id='Email' name='email' placeholder='Enter Email Address' onChange={(e)=>setEmail(e.target.value)}
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,0.4)]'
                />
                </label>
                    )
                }

                <button type='submit'>
                    {
                        !emailSent ? "Reset Password" : "Resend Email"
                    }
                </button>
            </form>
            <div>
                <Link to="/login">
                <p>Back to Login</p>
                </Link>
            </div>
        </div>
            )}
    </div>
  )
}

export default ForgotPassword