import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, clearError } from "../features/authSlice";
import { MdRestaurant, MdLock, MdEmail, MdPerson, MdPhone, MdShield } from "react-icons/md";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "waiter",
  });
  const [successMsg, setSuccessMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    if (isLogin) {
      const result = await dispatch(loginUser({ email: formData.email, password: formData.password }));
      if (loginUser.fulfilled.match(result)) {
        navigate("/");
      }
    } else {
      const result = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(result)) {
        setSuccessMsg("Account registered successfully! Please sign in.");
        setIsLogin(true);
        setFormData({ name: "", email: "", phone: "", password: "", role: "waiter" });
      }
    }
  };

  const handleQuickLogin = (email, password) => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-6 sm:p-8 shadow-2xl z-10">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 text-3xl mb-3 shadow-inner">
            <MdRestaurant />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Restaurant POS System
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isLogin ? "Sign in to access your role-based workspace" : "Register a new POS staff account"}
          </p>
        </div>

        {/* Auth Toggle Tabs */}
        <div className="flex bg-[#141414] p-1.5 rounded-xl mb-5 border border-[#2a2a2a]">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              dispatch(clearError());
              setSuccessMsg("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isLogin ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              dispatch(clearError());
              setSuccessMsg("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isLogin ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Error & Success Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl text-xs mb-4">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl text-xs mb-4">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Staff Full Name"
                    className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Phone Number</label>
                <div className="relative">
                  <MdPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01712345678"
                    className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Select System Role</label>
                <div className="relative">
                  <MdShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-amber-400 font-extrabold pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none cursor-pointer"
                  >
                    <option value="waiter">Waiter (Table Staff)</option>
                    <option value="cashier">Cashier (Billing)</option>
                    <option value="chef">Chef (Kitchen)</option>
                    <option value="admin">Admin (Manager)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@pos.com"
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black py-3 px-4 rounded-xl transition-all shadow-lg text-xs flex items-center justify-center cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : isLogin ? (
              "Sign In to POS Workspace"
            ) : (
              "Register New Account"
            )}
          </button>
        </form>

        {/* Quick Credentials Helper */}
        {isLogin && (
          <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
            <p className="text-[11px] text-gray-400 mb-2 font-bold text-center">Quick Demo Login by Role:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@pos.com", "admin@pos.com")}
                className="bg-[#242424] hover:bg-[#303030] text-[10px] py-2 px-1.5 rounded-lg border border-[#333] text-amber-400 font-extrabold transition-colors cursor-pointer"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("cashier@pos.com", "cashier@pos.com")}
                className="bg-[#242424] hover:bg-[#303030] text-[10px] py-2 px-1.5 rounded-lg border border-[#333] text-blue-400 font-extrabold transition-colors cursor-pointer"
              >
                Cashier
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("waiter@pos.com", "waiter@pos.com")}
                className="bg-[#242424] hover:bg-[#303030] text-[10px] py-2 px-1.5 rounded-lg border border-[#333] text-emerald-400 font-extrabold transition-colors cursor-pointer"
              >
                Waiter
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("chef@pos.com", "chef@pos.com")}
                className="bg-[#242424] hover:bg-[#303030] text-[10px] py-2 px-1.5 rounded-lg border border-[#333] text-orange-400 font-extrabold transition-colors cursor-pointer"
              >
                Chef
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;