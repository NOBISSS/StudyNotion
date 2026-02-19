import React, { useState } from 'react'
import { HighlightText } from './HomePage/HighlightText'
import { CTAButton } from './HomePage/Button';
import Image from "../../assets/LoginGirlImage.webp"
import Lines from "../../assets/Lines2.png"
import { Link, useNavigate } from 'react-router-dom';
import { apiConnector } from '../../services/apiconnector';
import { endPoints } from '../../services/apis';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setLoading, setToken } from '../../slices/authSlice';
import axios from 'axios';
import { login } from '../../services/operations/authAPI';


export const Login = () => {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const HandleSubmit=async(e)=>{
        e.preventDefault();
        dispatch(login(email,password,navigate))
    }
  return (
    <div className='text-white bg-[#000917] m-4 md:m-10 p-5 px-30 flex items-center justify-between'>
        <div className='container flex flex-col md:flex-row w-full flex-col-reverse justify-center items-center'>
            {/*Left Side */}
            <div className='left-container flex flex-col w-full md:w-1/2 mt-5'>
                <h1 className='text-2xl md:text-3xl font-semibold'>Welcome Back</h1>
                <p className='text-sm md:text-[1.2vw] mt-2 text-[#AFB2BF]'>Build skills for today,tomorrow,and beyond.<br></br><HighlightText text="Education in future-proof your carrer"/></p>

                <div className='mt-5 flex flex-col gap-5 w-full max-w-[500px]'>
                <label htmlFor="Email">
                <span>Email Address <span className='text-red-500'>*</span></span><br></br>
                <input type='text' id='Email' name='email' placeholder='Enter Email Address'
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,0.4)]'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                </label>
                <label htmlFor="Password">
                <span>Password <span className='text-red-500'>*</span></span><br></br>
                <input type='text' id='Password' name='password' placeholder='Enter Email Address'
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,0.4)]'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                
                </label>
                <h3 className='text-right text-sm text-blue-400 hover:underline cursor-pointer'>
                    <Link to="/forgotpassword">
                    Forgot Password
                    </Link>
                    </h3>
                
                <div className='w-fit'
                onClick={(e)=>HandleSubmit(e)}
                >
                <CTAButton active={true} linkto="/login"
                >
                    Sign In
                </CTAButton>
                </div>
                </div>
            </div>
            {/*RIGHT SIDE */}
            <div className="right-container relative ml-10 md:w-1/2 flex items-center justify-center mt-8 md:mt-0 mb-10">
                
                <img src={Lines} className='absolute w-[420px] h-[300px] top-5 right-[5%] md:h-[400px] '/>
                <img className=' w-[400px] h-[300px] md:h-[400px] z-10'
                 src={Image}></img>
            </div>
        </div>
    </div>
  )
}
