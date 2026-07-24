import React from "react";
import logo from "../../assets/logo.png";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function Header() {
  return (
    <header className="flex justify-between items-center px-4 sm:px-8 bg-[#1a1a1a] h-16 border-b border-[#262626] shrink-0">
      {/* logo */}
      <div className="flex items-center gap-2 shrink-0">
        <img src={logo} className="h-7 w-7 sm:h-8 sm:w-8" alt="logo" />
        <h1 className="text-base sm:text-lg font-semibold text-[#f5f5f5]">Restro</h1>
      </div>

      {/* search */}
      <div className="hidden sm:flex items-center gap-3 bg-[#1f1f1f] px-4 py-1.5 w-full max-w-[300px] md:max-w-[450px] rounded-[15px]">
        <FaSearch className="text-[#ababab] text-sm shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-[#f5f5f5] text-sm w-full"
        />
      </div>

      {/* logged user details */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        <div className="bg-[#1f1f1f] rounded-[15px] p-2 sm:p-2.5 cursor-pointer hover:bg-[#262626] transition-colors">
          <FaBell className="text-[#f5f5f5] text-lg sm:text-xl" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
          <FaUserCircle className="text-[#f5f5f5] text-2xl sm:text-3xl" />
          <div className="hidden md:flex flex-col items-start">
            <h1 className="text-xs sm:text-sm text-[#f5f5f5] font-semibold leading-tight">Arnob Das</h1>
            <p className="text-[10px] sm:text-xs text-[#ababab] font-medium">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

