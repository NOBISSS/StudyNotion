import { useEffect, useState } from 'react'
import OTPInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux'
import { sendOtp, signUp } from '../services/operations/authAPI';
import { Link, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [otp,setOtp]=useState("");
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {signupData,loading}=useSelector((state)=>state.auth);

    useEffect(()=>{
        if(!signupData){
            navigate("/signup");
        }
    },[]);
    

    const HandleOnSubmit=async(e)=>{
        e.preventDefault();
        const{
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        }=signupData;
        dispatch(signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate))
        
    }
  return (
    <div className='text-white border-sky-100'>{
        loading ? (<div>Loading...</div>) : (
        <div className=''>
            <h1>Verify Email</h1>
            <p>A verification Code has been sent to you.Enter the Code Below</p>
            <form onSubmit={HandleOnSubmit} className='border-1'> 
                <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span>-</span>}
                renderInput={(props)=>(<input {...props} className='bg-[#000917]'/>)}
                />
                <button type='submit'>Verify Email</button>
            </form>
            <div className=''>
                <div>
                    <Link to="/signup">
                    <p>Back to Signup</p>
                    </Link>
                </div>
                    <button onClick={()=>dispatch(sendOtp(signupData.email))}>Resend It</button>
            </div>
            </div>
    )
    }</div>
  )
}

export default VerifyEmail