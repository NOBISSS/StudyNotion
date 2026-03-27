import React from 'react'
import { Link } from 'react-router-dom'
import * as Icons from "react-icons/vsc"

export const IconBtn = ({ children, active, linkto, iconName, text, onClick, type = "button",customClassName }) => {
  const Icon = Icons[iconName];

  const commonClasses = `flex items-center  justify-center gap-2 px-6 py-2 rounded-md font-bold transition-all duration-200
    ${active ? "bg-[#FFD60A] text-black" : "text-white bg-[#161D29]"} ${customClassName ? customClassName : ""}`;

  if (linkto) {
    // If linkto is provided → behave as a Link
    return (
      <Link to={linkto} className={commonClasses}>
        <span className="font-sm">{text}</span>
        {Icon ? <Icon className="text-lg" /> : <span className="text-red-500">!</span>}
      </Link>
    );
  }

  // Otherwise behave as a button
  return (
    <button type={type} onClick={onClick} className={commonClasses}>
      <span className="font-sm">{text}</span>
      {Icon ? <Icon className="text-lg" /> : <span className="text-red-500">!</span>}
    </button>
  );
};