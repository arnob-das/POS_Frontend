import { useState } from "react";
import { BiSolidDish } from "react-icons/bi";
import { FaHome, FaUserShield } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../features/customerSlice";

function BottomNav() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestNumbers, setGuestNumbers] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const rawRole = user?.role || "staff";
  const role = rawRole === "waiter" ? "staff" : rawRole;

  const handleGuestNumbersIncrease = () => {
    setGuestNumbers((prev) => prev + 1);
  };

  const handleGuestNumbersDecrease = () => {
    if (guestNumbers > 1) {
      setGuestNumbers((prev) => prev - 1);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    if (!customerName || !customerPhone) {
      alert("Please fill in customer name and phone number");
      return;
    }
    dispatch(
      setCustomer({
        name: customerName,
        phone: customerPhone,
        guests: guestNumbers,
      })
    );
    setIsModalOpen(false);
    navigate("/tables");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c1c]/95 backdrop-blur-md px-4 py-2 h-16 flex justify-around items-center z-40 border-t border-[#2a2a2a] shadow-2xl">
      {/* 1. Home Tab */}
      <button
        onClick={() => navigate("/")}
        className={`flex items-center justify-center text-gray-400 hover:text-white ${
          isActive("/")
            ? "bg-[#282828] text-amber-400 font-extrabold border border-amber-500/30"
            : "bg-transparent"
        } px-3.5 py-2 rounded-xl transition-all cursor-pointer`}
      >
        <FaHome className="text-base mr-1.5" />
        <span className="text-xs font-semibold">Home</span>
      </button>

      {/* 2. Orders Tab (For Admin, Staff, Cashier) */}
      {role !== "kitchen" && (
        <button
          onClick={() => navigate("/orders")}
          className={`flex items-center justify-center text-gray-400 hover:text-white ${
            isActive("/orders")
              ? "bg-[#282828] text-amber-400 font-extrabold border border-amber-500/30"
              : "bg-transparent"
          } px-3.5 py-2 rounded-xl transition-all cursor-pointer`}
        >
          <MdOutlineReorder className="text-base mr-1.5" />
          <span className="text-xs font-semibold">Orders</span>
        </button>
      )}

      {/* 3. Take Order Floating Button (For Staff/Waiter & Admin) */}
      {(role === "staff" || role === "admin") && (
        <div className="relative -top-3 flex items-center justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isActive("/menu")}
            title="Take New Order"
            className="bg-gradient-to-tr from-amber-500 to-yellow-400 text-black rounded-full p-3.5 shadow-2xl border-4 border-[#141414] transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            <BiSolidDish size={22} />
          </button>
        </div>
      )}

      {/* 4. Tables Tab (For Admin & Staff) */}
      {(role === "staff" || role === "admin") && (
        <button
          onClick={() => navigate("/tables")}
          className={`flex items-center justify-center text-gray-400 hover:text-white ${
            isActive("/tables")
              ? "bg-[#282828] text-amber-400 font-extrabold border border-amber-500/30"
              : "bg-transparent"
          } px-3.5 py-2 rounded-xl transition-all cursor-pointer`}
        >
          <MdTableBar className="text-base mr-1.5" />
          <span className="text-xs font-semibold">Tables</span>
        </button>
      )}

      {/* 5. Admin Tab (Only rendered if admin) */}
      {role === "admin" && (
        <button
          onClick={() => navigate("/admin")}
          className={`flex items-center justify-center text-gray-400 hover:text-white ${
            isActive("/admin")
              ? "bg-[#282828] text-amber-400 font-extrabold border border-amber-500/30"
              : "bg-transparent"
          } px-3.5 py-2 rounded-xl transition-all cursor-pointer`}
        >
          <FaUserShield className="text-base text-amber-400 mr-1.5" />
          <span className="text-xs font-semibold">Admin</span>
        </button>
      )}

      {/* Customer Entry Modal */}
      {isModalOpen && (
        <Modal title="Create New Customer Order" onCloseModal={() => setIsModalOpen(false)}>
          <div className="space-y-3.5 pt-1">
            <div>
              <label className="block text-gray-300 text-xs font-bold mb-1">
                Customer Name *
              </label>
              <div className="flex items-center rounded-xl px-3.5 py-2.5 bg-[#141414] border border-[#333]">
                <input
                  className="bg-transparent text-white focus:outline-none w-full text-xs"
                  type="text"
                  placeholder="Enter Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-bold mb-1">
                Customer Phone Number *
              </label>
              <div className="flex items-center rounded-xl px-3.5 py-2.5 bg-[#141414] border border-[#333]">
                <input
                  className="bg-transparent text-white focus:outline-none w-full text-xs"
                  type="tel"
                  placeholder="01712345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-xs font-bold mb-1">
                Number of Guests
              </label>
              <div className="flex justify-between items-center rounded-xl px-3.5 py-2 bg-[#141414] border border-[#333]">
                <button
                  type="button"
                  onClick={handleGuestNumbersDecrease}
                  className="bg-[#282828] hover:bg-[#333] text-white w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="text-white font-bold text-xs">
                  {guestNumbers} {guestNumbers === 1 ? "Person" : "Persons"}
                </span>
                <button
                  type="button"
                  onClick={handleGuestNumbersIncrease}
                  className="bg-[#282828] hover:bg-[#333] text-white w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleCreateOrder}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black py-3 text-xs rounded-xl transition-all shadow-lg mt-1 cursor-pointer"
            >
              Proceed to Table Selection
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default BottomNav;
