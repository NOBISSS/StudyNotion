import { NavLink } from "react-router-dom";
import * as Icons from "react-icons/vsc";

const SideBarLink = ({ link, iconName, collapsed }) => {
  const Icon = Icons[iconName];

  return (
    <NavLink
      to={link.path}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-all
        ${isActive ? "bg-[#2C333F] text-yellow-400" : "text-[#6B7280] hover:bg-[#2C333F] hover:text-white"}
        ${collapsed ? "justify-center" : "justify-start"}`
      }
    >
      {/* ICON */}
      <span className="text-lg">
        <Icon />
      </span>

      {/* TEXT */}
      <span
        className={`
          text-sm font-medium whitespace-nowrap transition-all duration-200
          ${collapsed ? "hidden" : "block"}
        `}
      >
        {link.name}
      </span>
    </NavLink>
  );
};

export default SideBarLink;