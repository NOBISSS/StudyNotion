import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { IconBtn } from '../../common/IconBtn';

const MyProfile = () => {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate(); 
    return (
        <div className='OUTTER DIV text-white py-5 px-7 md:px-10 lg: w-[80vw] '>
            <div className='INNER-DIV flex flex-col gap-10 py-5 px-10'>
                <h1 className='text-2xl mb-5 md:text-3xl   font-semibold'>
                    My Profile
                </h1>

                <div className='flex gap-10 p-8 justify-between h-1/2 bg-[#161D29] rounded-md items-center'>
                    <div className='ml-5 flex gap-3 items-center'>
                        <img src={user?.image} alt={`profile-${user?.firstName}`}
                            className='aspect-square w-[75px] rounded-full object-cover'
                        />
                        <div>
                            <h3 className='text-[21px] font-semibold'>{user?.firstName + " " + user?.lastName}</h3>

                            <p className='text-[#838894]'>{user?.email}</p>
                        </div>
                    </div>
                    <IconBtn
                        text="Edit"
                        iconName="VscEdit"
                        active={1}
                        linkto={"/dashboard/settings"} />
                </div>
                <div className='flex pl-12 flex-col gap-10 p-7 justify-between h-1/2 bg-[#161D29] rounded-md'>
                    <div className='flex justify-between'>
                        <h3 className='text-[20px] font-semibold'>About</h3>
                        <IconBtn
                            text="Edit"
                            iconName="VscEdit"
                            active={1}
                            linkto={"/dashboard/settings"} />
                    </div>
                    <div className='ABOUT_CONTENT'>
                        <p>{user?.additionalDetails?.about || "Write Something About Yourself"}</p>
                    </div>
                </div>
                <div className='flex pl-13 flex-col gap-10 p-7 justify-between h-1/2 bg-[#161D29] rounded-md'>
                    <div className='flex justify-between'>
                        <h3 className='text-[20px] font-semibold'>Personal Details</h3>
                        <IconBtn
                            text="Edit"
                            iconName="VscEdit"
                            active={1}
                            linkto={"/dashboard/settings"}
                            />
                    </div>
                    <div className='PERSONAL_DETAIL flex justify-between'>
                        <div className='flex flex-col gap-10'>
                            <div>
                                <p className='text-[#424854] text-[20px]'>First Name</p>
                                <p>{user?.firstName ?? "Add Your FirstName"}</p>
                            </div>
                            <div>
                                <p className='text-[#424854] text-[20px]'>Email</p>
                                <p>{user?.email ?? "Add Your Email"}</p>
                            </div>
                            <div>
                                <p className='text-[#424854] text-[20px]'>Gender</p>
                                <p>{user?.additionalDetails?.gender || "Add Your Gender"}</p>
                            </div>
                        </div>
                        <div className='flex flex-col gap-10 lg:mr-40 sm:mr-2'>
                            <div>
                                <p className='text-[#424854] text-[20px]'>Last Name</p>
                                <p>{user?.lastName ?? "Add Your LastName"}</p>
                            </div>
                            <div>
                                <p className='text-[#424854] text-[20px]'>Phone Number</p>
                                <p>{user?.additionalDetails?.contactNumber ?? "Add Your Contact Number"}</p>
                            </div>

                            <div>
                                <p className='text-[#424854] text-[20px]'>Date Of Birth</p>
                                <p>{user?.additionalDetails?.dateOfBirth?.split("T")[0] ?? "Add Date Of Birth"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile

