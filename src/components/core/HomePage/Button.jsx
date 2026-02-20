import React from 'react';
import { Link } from 'react-router-dom';

export const CTAButton = ({ children, active, linkto, type = "button", onClick }) => {
  const baseClasses = `text-center text-[17px] px-6 py-3 rounded-md font-bold 
    ${active ? "bg-[#FFD60A] text-black" : "bg-[#2c3139] text-[#999DAA]"}
    hover:scale-95 transition-all duration-200`;

  if (linkto) {
    return (
      <Link to={linkto}>
        <div className={baseClasses}>
          {children}
        </div>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
};
