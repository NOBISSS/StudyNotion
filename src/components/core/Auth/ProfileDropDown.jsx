import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../../services/operations/authAPI';
import { Link, useNavigate } from 'react-router-dom';
import MyProfile from '../Dashboard/MyProfile';
import { IconBtn } from '../../common/IconBtn';
import SideBarLink from '../Dashboard/SideBarLink';
const ProfileDropDown = () => {
  const link={
            id:2,
            name:"Dashboard",
            path:"/dashboard/instructor",
            type:"INSTRCUTOR",
            icon:"VscDashboard",
        }
  const navigate=useNavigate();
  const dispatch=useDispatch();
  return (
    <div className='text-white absolute top-15 right-20 w-[150px] shadow-lg p-2 bg-[#161D29] z-10'>
       <IconBtn iconName="VscDashboard" text={"Dashboard"} linkto="/dashboard/my-profile"/>
      <button
                onClick={() => dispatch(logout(navigate))}
                className="w-full mt-2 text-left px-4 py-2 text-white hover:bg-red-600 rounded-md"
            >
                Logout
            </button>
    </div>
  )
}

export default ProfileDropDown