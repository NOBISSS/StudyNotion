import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import CountryCode from "../../../data/countrycode.json"
const ContactUsForm = () => {
    const [loading,setLoading]=useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors,isSubmitSuccessful}
    }=useForm();

    const submitContactForm=async(data)=>{
        console.log(data);
    }
    useEffect(()=>{
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstname:"",
                lastname:"",
                message:"",
                phoneNo:""
            })
        }
    },[reset,isSubmitSuccessful])


  return (
    <form onSubmit={handleSubmit(submitContactForm)} className='mx-auto'>
        <div className='flex gap-5 mt-10'>
                <label htmlFor="Firstname">
                <span>First Name</span><br></br>
                <input 
                type='text' 
                id='firstname' 
                name='firstname' 
                placeholder='Enter First Name'
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                {...register("firstname",{required:true})}
            />
                {
                errors.firstname &&(
                    <span className='text-red-500'>
                        {console.log("MESSAGE PRINTED")}
                        Enter Your Name
                    </span>
                )
                }
                </label>
                <label htmlFor="Lastname">
                <span>Last Name</span><br></br>
                <input type='text' id='Lastname' name='lastname' placeholder='Enter last name' {...register("lastname")}
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                />
                </label>
            </div>
            {/*Email and Message and button*/}
            <div className='flex flex-col mt-10 gap-10'>
                <label htmlFor="email">
                <span>Email Address</span><br></br>
                <input type='text' id='email' name='email' placeholder='Enter email address'
                className='p-3 w-[70%] rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                {...register("email",{required:true})}
                />
                {
                errors.email &&(
                    <span className='text-red-500'>
                        Enter Your Email
                    </span>
                )
                }
                </label>
                {/* phone NO */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor='phonenumber'>Phone Number</label>
                    <div className='flex gap-6'>
                        {/* dropdown */}
                        <div className='bg-black w-[16.5%] gap-3'>
                            <select name='dropdown' id='dropdown' {...register("countrycode",{required:true})}
                            className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                            >
                                {
                                    CountryCode.map((element,index)=>{
                                        return (
                                            <option value={element.code} key={index}>{element.code} - {element.country}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='w-[70%]'>
                <input type='number' id='phoneNo' name='phoneNo' placeholder='Enter Contact No'
                className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                {...register("phoneNo",{required:{value:10,message:"Enter  Phone Number"},
                maxLength:{value:10,message:"Invalid Phone Number"},
                minLength:{value:8,message:"Invalid Phone Number"}
            })}
                />
                {
                    
                    errors.phoneNo && (
                        <span className='text-red-500'>
                            {errors.phoneNo.message}
                        </span>   
                        
                    )
                    
                }
                {//console.log("error object:",errors)
                }
                        </div>
                    </div>
                </div>
                {/*Message Text Area */}
                <div className='mt-2'>
                    <label htmlFor='message'>Message
                        <textarea
                        name='message'
                        id='message'
                        cols={40}
                        rows={7}
                        placeholder='Enter Your message here'
                        {...register("message")}
                        className='resize-none p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                        />
                        </label>

                </div>
                <button type='submit'
                className='text-center text-[17px] px-4 py-3 rounded-md font-bold 
         bg-[#FFD60A] text-black
        hover:scale-95 transition-all duration-200'
                >
                    SendMessage
                </button>
            </div>
    </form>
  )
}

export default ContactUsForm