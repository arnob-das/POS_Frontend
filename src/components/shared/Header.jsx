import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { FaSearch, FaUserCircle, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/authSlice";
import { useNavigate, Link } from "react-router-dom";

function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/auth");
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "cashier":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "kitchen":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <header className="flex justify-between items-center px-4 sm:px-8 bg-[#141414]/90 backdrop-blur-md h-16 border-b border-[#262626] shrink-0 z-40 sticky top-0 shadow-lg">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-3 shrink-0 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-[#141414] rounded-[10px] flex items-center justify-center">
            <img src={logo} className="h-5 w-5 object-contain" alt="logo" />
          </div>
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
            Restro<span className="text-amber-400">POS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          </h1>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Restaurant Systems</p>
        </div>
      </Link>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center gap-3 bg-[#1e1e1e] px-4 py-2 w-full max-w-[380px] rounded-xl border border-[#2a2a2a] focus-within:border-amber-500/50 transition-all shadow-inner">
        <FaSearch className="text-gray-400 text-xs shrink-0" />
        <input
          type="text"
          placeholder="Quick search dishes, active tables, bills..."
          className="bg-transparent outline-none text-white text-xs w-full placeholder-gray-500"
        />
      </div>

      {/* User Controls */}
      <div className="flex items-center gap-3 shrink-0 relative">

        {user ? (
          <div className="relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 cursor-pointer bg-[#1e1e1e] hover:bg-[#262626] px-3 py-1.5 rounded-xl border border-[#2a2a2a] transition-all shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-extrabold text-xs flex items-center justify-center uppercase shadow-inner">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <h2 className="text-xs text-white font-bold leading-tight">
                  {user.name || "Employee"}
                </h2>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${getRoleBadgeColor(user.role)} mt-0.5`}>
                  {user.role === "staff" ? "Staff / Waiter" : user.role}
                </span>
              </div>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl shadow-2xl py-2 z-50 divide-y divide-[#2a2a2a]">
                <div className="px-4 py-2.5">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{user.email}</p>
                </div>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-[#262626] transition-colors"
                  >
                    <FaShieldAlt /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-[#262626] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <FaSignOutAlt /> Sign Out Account
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/auth"
            className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black px-4 py-2 rounded-xl text-xs font-extrabold shadow transition-all"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
