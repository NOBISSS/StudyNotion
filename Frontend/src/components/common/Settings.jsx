import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { IconBtn } from './IconBtn';
import { CTAButton } from '../core/HomePage/Button';
import { UpdatePassword, UpdatePersonalInfo, updateProfilePicture } from '../../services/operations/authAPI';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user } = useSelector((state) => state.profile);
    const navigate=useNavigate();
    //console.log(user);
    const dispatch = useDispatch();
    //USE STATES
    const [profilePic, setProfilePic] = useState(null);
    const fileInputRef = useRef(null);
    const [passwordData, setPasswordData] = useState({ oldPassword: "", confirmPassword: "",email:user?.email });

    const defaultAdditionalDetails = {
    gender: user.additionalDetails.gender,
    dateOfBirth: user.additionalDetails.dateOfBirth,
    about: user.about,
    contactNumber: user.additionalDetails.contactNumber
    };

    const [formData, setFormData] = useState({
        ...user,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        additionalDetails: defaultAdditionalDetails
    });
    //const [formData,setFormData]=useState(user);
    useEffect(() => {
        
        if (user) {
            let details=user.additionalDetails;

            if(typeof details === "string"){
                try{
                    details=JSON.parse(details);
                }catch{
                    details={};
                }
            }
            //console.log("DETAILS OBJECT>>>>>>",details);
            setFormData({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                additionalDetails: {
                    gender: details?.additionalDetails?.gender,
                    dateOfBirth: details?.dateOfBirth ? details?.dateOfBirth : "",
                    about: details?.about || "",
                    contactNumber: details?.contactNumber || ""
                }
            });
        }
    }, [user]);

    const HandleChange = (e) => {
        const { name, value } = e.target;
        //console.log(formData)
        if (name in formData.additionalDetails) {
            setFormData(prev => ({ ...prev, additionalDetails: { ...prev.additionalDetails, [name]: value } }));
        } else { setFormData(prev => ({ ...prev, [name]: value })); }
    };

    const genderOptions = [
        "Male",
        "Female",
        "Non-Binary",
        "Prefer not to say",
        "Other"
    ];

    const HandleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Data:", formData)
    }

    const handleFileChange = (e) => {
        //console.log(e);
        e.preventDefault();
        //console.log("PROFILE PIC UPLOADED");
        //dispatch(UpdateDisplayPicture())
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            console.log("FILE IS SELECTED...", file);
        }

        console.log(profilePic)
    }

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        if (!profilePic) {
            toast.error("PLEASE SELECT PROFILE PHOTO BEFORE UPLOADING");
            return;
        }
        console.log("PROFILE PHOTO:", profilePic)
        dispatch(updateProfilePicture(profilePic));
    }

    const HandlePasswordChange=(e)=>{
        e.preventDefault();
        const { name, value } = e.target;
    setPasswordData((prev) => ({
        ...prev,
        [name]: value
    }));

    }

    const HandlePersonalDetails = (e) => {
        e.preventDefault();
        console.log("Personal Details UPLOADED");
        dispatch(UpdatePersonalInfo(formData));
    }

    const HandlePassword = (e) => {
        e.preventDefault();
        if (passwordData.password == "" && passwordData.confirmPassword=="") {
            toast.error("Please Enter Password");
            return;
        }
        console.log("Password Updated Successfully");
        dispatch(UpdatePassword(passwordData,navigate))
    }

    return (
        <div className='OUTTER DIV  text-white py-5 pl-7 w-[80vw] overflow-hidden'>
            <div className='INNER-DIV flex flex-col gap-10 py-5 px-10'>
                <h1 className='text-3xl mb-5 font-semibold'>
                    Edit Profile
                </h1>

                <div className='flex gap-10 p-8 justify-between h-1/2 bg-[#161D29] rounded-md items-center'>
                    <div className='ml-5 flex gap-3 items-center'>
                        <img src={user?.image} alt={`profile-${user?.firstName}`}
                            className='aspect-square w-[75px] rounded-full object-cover'
                        />

                        <div className='mx-auto items-center'>
                            <form>
                                <h3 className='text-[17px] font-sm mb-2'>Change Profile Picture</h3>
                                <input type='file' ref={fileInputRef} placeholder='Select' name='displayPicture' className='hidden bg-red-600' onChange={(e) => handleFileChange(e)} />
                                <div className='flex flex-row gap-5'>
                                    <button type='button' className='bg-[#2C333F] px-5.5 py-2 rounded-md text-[#C5C7D4] font-medium cursor-pointer'
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        Select
                                    </button>
                                    <IconBtn iconName={"VscShare"} active={1} type='submit' text={"Upload"} onClick={(e) => handleProfileSubmit(e)} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <form onSubmit={(e) => HandlePersonalDetails(e)}>
                    <div className='flex pl-13 flex-col gap-7 p-5 justify-between h-1/2 bg-[#161D29] rounded-md'>

                        <div className='flex justify-between'>
                            <h3 className='text-[20px] font-semibold'>Personal Information</h3>

                        </div>
                        <div className='PERSONAL_INFORMATIO w-full gap-10 flex '>
                            <div className='PDR-1 flex flex-col gap-6 w-[50%]'>
                                <label htmlFor="firstName">
                                    <span>First Name</span><br></br>
                                    <input
                                        type='text'
                                        id='firstName'
                                        name='firstName'
                                        value={formData?.firstName || ""}
                                        onChange={(e) => HandleChange(e)}
                                        placeholder='Enter FirstName'
                                        className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]' /></label>
                                <label htmlFor="dateOfBirth">
                                    <span>Date Of Birth</span><br></br>
                                    <input
                                        type='date'
                                        id='dateOfBirth'
                                        name='dateOfBirth'
                                        onChange={(e) => HandleChange(e)}
                                        value={formData.additionalDetails.dateOfBirth || new Date()}
                                        placeholder='Enter dateOfBirth'
                                        className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]' /></label>
                                <label htmlFor="contactNumber">
                                    <span>Contact No</span><br></br>
                                    <input
                                        type='text'
                                        id='contactNumber'
                                        name='contactNumber'
                                        value={formData?.additionalDetails?.contactNumber || ""}
                                        onChange={(e) => HandleChange(e)}
                                        placeholder='Enter Contact Number'
                                        className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]' /></label>
                            </div>
                            <div className='PDR-1 flex flex-col gap-6 w-[50%]'>
                                <label htmlFor="lastName">
                                    <span>Last Name</span><br></br>
                                    <input
                                        type='text'
                                        id='lastName'
                                        name='lastName'
                                        value={formData?.lastName || ""}
                                        onChange={(e) => HandleChange(e)}
                                        placeholder='Enter Last Name'
                                        className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]' /></label>
                                <label htmlFor="gender">
                                    <span>Gender</span><br></br>
                                    <select name='gender' id='gender'
                                        className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]'
                                        value={formData?.additionalDetails?.gender}
                                        onChange={(e) => HandleChange(e)}
                                    >{

                                            genderOptions.map((element, index) => {
                                                return (
                                                    <option value={element || " "} key={index}>{element}</option>
                                                )
                                            })
                                        }
                                    </select></label>
                                <label htmlFor="about">
                                    <span>About</span><br></br>
                                    <input
                                        type='text'
                                        id='about'
                                        name='about'
                                        value={formData?.additionalDetails?.about || ""}
                                        onChange={(e) => HandleChange(e)}
                                        placeholder='Enter About Yourself'
                                        className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]' /></label>
                            </div>
                        </div>
                    </div>

                    <div className=' mt-5 w-full gap-4 mx-auto flex justify-end items-end-safe'>
                        <CTAButton active={0} text={"Cancel"}>
                            Cancel
                        </CTAButton>
                        <CTAButton type="submit" active={1} >
                            Save
                        </CTAButton>
                    </div>
                </form>
                <form onSubmit={(e) => HandlePassword(e)}>
                    <div className='flex pl-13 flex-col gap-7 p-5 justify-between h-1/2 bg-[#161D29] rounded-md'>
                        <div className='flex justify-between'>
                            <h3 className='text-[20px] font-semibold'>Password</h3>

                        </div>
                        <div className='PERSONAL_INFORMATIO w-full gap-10 flex '>
                            <div className='PDR-1 flex flex-col gap-6 w-[50%]'>
                                <label htmlFor="oldPassword">
                                    <span>Current Password</span><br></br>
                                    <input
                                        type='password'
                                        id='oldPassword'
                                        name='oldPassword'
                                        value={passwordData.password}
                                        onChange={(e) => HandlePasswordChange(e)}
                                        placeholder='Enter Current Password'
                                        className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]' /></label>
                            </div>
                            <div className='PDR-1 flex flex-col gap-6 w-[50%]'>
                                <label htmlFor="confirmPassword">
                                    <span>Confirm Password</span><br></br>
                                    <input
                                        type='password'
                                        id='confirmPassword'
                                        value={passwordData.confirmPassword}
                                        name='confirmPassword'
                                        onChange={(e) => HandlePasswordChange(e)}
                                        placeholder='Enter Confirm Password'
                                        className='p-3 w-full rounded-[10px] mt-1 bg-[#2c3139] shadow-[0_0.5px_0_0_rgba(255,255,255,2)]' /></label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5 w-full gap-4 mx-auto flex justify-end items-end-safe'>
                        <CTAButton active={0} text={"Cancel"}>
                            Cancel
                        </CTAButton>
                        <CTAButton active={1} onClick={(e) => HandlePassword(e)}>
                            Update
                        </CTAButton>
                    </div>
                </form>
                <div className='bg-[#340019] flex border-[2px] border-[#691432]  lg:pl-12 rounded-md sm:pl-2'>
                    <div className='w-1/14 mt-8'>
                        {/* <img src={Logo2} className='w-[60px] h-[60px] rounded-full bg-red-900 p-3'/> */}
                        <svg stroke="currentColor" fill="none"
                            strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-red-600 bg-red-900 rounded-full w-[50px] h-[50px] p-2.5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </div>
                    <div className='lg:-ml-6 flex flex-col p-8 gap-2'>
                        <h3 className='text-[20px] font-semibold'>Delete Account</h3>
                        <p className='text-[#FBC7D1] lg:w-[55%] font-sm'>
                            Would you like to delete account?<br></br> This account may contain Paid Courses. Deleting your account is permanent and will remove all the contain associated with it.
                        </p>
                        <p className='text-red-500 cursor-pointer'><i>I want to delete my account.</i></p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Settings