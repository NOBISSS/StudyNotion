import * as Icons from "react-icons/vsc"
import { matchPath, NavLink, useLocation } from 'react-router-dom';
import * as VscIcons from "react-icons/vsc";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import * as FiIcons from "react-icons/fi";
import * as HiIcons from "react-icons/hi";

const SideBarLink = ({ link, iconName }) => {
    
    const Icon = Icons[iconName];
    const location = useLocation();
    const matchRoute = (route) => matchPath({ path: route }, location.pathname);

    return (
        <NavLink
            to={link?.path}
            className={({ isActive }) =>
                `relative px-8 py-2 text-sm font-medium ${isActive ? "bg-yellow-700 text-white" : "text-[#838894]"}`
            }
        >
            <span className={` text-[#838894] absolute left-0 top-0 h-full w-[0.2rem]  ${matchRoute(link.path) ? "bg-yellow-400 text-white" : "bg-transparent "}`}>
            </span>
            <div className='flex items-center gap-x-2'>
                {Icon ? <Icon className="text-lg" /> : <span className="text-red-500">!</span>}
                <span>{link.name}</span>
            </div>
        </NavLink>
    )
}

export default SideBarLink