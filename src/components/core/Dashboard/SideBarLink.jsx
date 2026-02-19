import React from 'react'
import * as Icons from "react-icons/vsc"
import { useDispatch } from 'react-redux';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

const SideBarLink = ({link,iconName}) => {
    const Icon=Icons[iconName];
    const location= useLocation();
    const dispatch=useDispatch();

    const matchRoute=(route)=> matchPath({path:route},location.pathname);

  return (
    <NavLink
        to={link?.path}
        className={`text-[#838894] relative px-8 py-2 text-sm font-medium ${matchRoute(link?.path) ? "bg-yellow-700 text-white" : "bg-transparent" }`}
    >
        <span className={ ` text-[#838894] absolute left-0 top-0 h-full w-[0.2rem]  ${matchRoute(link.path) ? "bg-yellow-400 text-white" : "bg-transparent "}`}>

        </span>

        <div className='flex items-center gap-x-2'>
            {Icon ? <Icon className="text-lg" /> : <span className="text-red-500">!</span>}
            <span>{link.name}</span>
        </div>
    </NavLink>
  )
}

export default SideBarLink