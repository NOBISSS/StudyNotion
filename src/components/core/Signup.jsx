import React, { useState } from 'react'
import { HighlightText } from './HomePage/HighlightText'
import { CTAButton } from './HomePage/Button';
import Image from "../../assets/LoginGirlImage.webp"
import Lines from "../../assets/Lines2.png"
import { apiConnector } from '../../services/apiconnector';
import { endPoints } from '../../services/apis';
import { useDispatch } from 'react-redux';
import { sendOtp, signUp } from '../../services/operations/authAPI';
import {setSignUpData} from "../../slices/authSlice";
import { Link, useNavigate } from 'react-router-dom';
export const Signup = () => {
    console.log("ON SIGNUP PAGE");
    const tabsName=[
    "Student",
    "Instructor",
    ]
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [formData,setFormData]=useState({
        accountType:currentTab,
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:""
    })

    const {SIGNUP_API}=endPoints;
    const {accountType,firstName,lastName,email,password,confirmPassword}=formData;
    
    const handleTabClick = (element) => {
        setCurrentTab(element);
        setFormData((prevData) => ({
        ...prevData,
        accountType: element,
        }));
    };

    const HandleOnChange=(e,element)=>{
        setFormData((prevData)=>(
            {
            ...prevData,
            [e.target.name]:e.target.value,
            }
        ))
    }
    const HandleOnSubmit=async(e)=>{
        e.preventDefault();
        dispatch(setSignUpData({accountType,firstName,lastName,email,password,confirmPassword}));
        dispatch(sendOtp(email,navigate));
    }
  return (
    <div className='text-white bg-[#000917] m-4 md:m-10 p-5 px-30 flex items-center justify-center'>
        <div className='container flex flex-col md:flex-row w-full flex-col-reverse justify-center items-center'>
            {/*Left Side */}
            <div className='left-containerpx-auto flex flex-col w-full md:w-1/2 mt-5'>
                <h1 className='text-2xl md:text-3xl font-semibold'>Join the millions learning to code with StudyNotion for free</h1>
                <p className='text-sm md:text-[1.2vw] mt-2 text-[#AFB2BF]'>Build skills for today, tomorrow, and beyond.<br></br><HighlightText text="Education to future-proof your career"/></p>
                <div className='w-[250px] flex flex-row rounded-full bg-[#161D29] mb-5 mt-5 shadow-[0_0.50px_0_0_rgba(255,255,255,0.4)] py-1 px-1'>
            {
                tabsName.map((element,index)=>{
                    return (
                        <div
                        className={`text-[16px] flex flex-row items-center gap-2
                        ${currentTab===element ? "bg-[#000917] text-white font-medium" 
                            : "text-[#838894]"} rounded-full transition-all duration-200 cursor-pointer hover:bg-[#000917] hover:text-[#F9F9F9] px-7 py-2`}
                        key={index}
                        name="accountType"
                        value={element}
                        
                        onClick={()=>handleTabClick(element)}
                        >
                            {element}
                        </div>
                    )
                })
            }
        </div>
                <form onSubmit={HandleOnSubmit}>
                <div className='mt-5 px-1.5 flex flex-col gap-5 w-full max-w-[500px]'>
                <div className='flex gap-5'>
                <label htmlFor="FirstName">
                <span>First Name <span className='text-red-500'>*</span></span><br></br>
                <input type='text' id='FirstName' name='firstName' 
                value={firstName}
                onChange={HandleOnChange}
                placeholder='Enter First Name'
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                />
                </label>
                <label htmlFor="LastName">
                <span>Last Name <span className='text-red-500'>*</span></span><br></br>
                <input type='text' id='LastName' name='lastName' placeholder='Enter last name'
                value={lastName}
                onChange={HandleOnChange}
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                />
                </label>
                
                </div>
                <label htmlFor="email">
                <span>Email <span className='text-red-500'>*</span></span><br></br>
                <input type='text' id='email' name='email' placeholder='Enter email address'
                value={email}
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                onChange={HandleOnChange}
                />
                </label>
                <div className='flex gap-5'>
                <label htmlFor="createPassword">
                <span>Create Password <span className='text-red-500'>*</span></span><br></br>
                <input type='text' id='createPassword' name='password' placeholder='Enter Password'
                onChange={HandleOnChange}
                value={password}
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                />
                </label>
                <label htmlFor="confirmPassword">
                <span>Confirm Password<span className='text-red-500'>*</span></span><br></br>
                <input type='text' id='confirmPassword' name='confirmPassword' placeholder='Confirm Password'
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                value={confirmPassword}
                onChange={HandleOnChange}
                />
                </label>
                </div>
                <div className='w-auto'>
                <button
  type="submit"
  className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-md shadow-md hover:bg-yellow-300 transition"
>
  Create Account
</button>
                </div>
                </div>
                </form>
            </div>
            {/*RIGHT SIDE */}
            <div className="right-container relative w-full md:w-1/2 flex items-center justify-center mt-8 md:mt-0 mb-10">
                
                <img src={Lines} className='absolute w-auto h-[400px] top-5 right-[5%] md:h-[400px] '/>
                <img className=' w-auto h-[400px] md:h-[400px] z-10'
                 src={Image}></img>
            </div>
        </div>
    </div>
  )
}
