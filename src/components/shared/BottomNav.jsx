import { useState } from "react";
import { BiSolidDish } from "react-icons/bi";
import { CiCircleMore } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../features/customerSlice";

function BottomNav() {
  const [isModalOpen, setIsMoalOpen] = useState(false);
  const [guestNumbers, setGuestNumbers] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const location = useLocation();

  const handleGuestNumbersIncrease = () => {
    setGuestNumbers((prev) => prev + 1);
  };

  const handleGuestNumbersDecrease = () => {
    if (guestNumbers > 0) {
      setGuestNumbers((prev) => prev - 1);
    }
  };

  const onCloseModal = () => {
    console.log("Clicked");
    setIsMoalOpen(false);
  };

  const onOpenModal = () => {
    setIsMoalOpen(true);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    dispatch(
      setCustomer({
        name: customerName,
        phone: customerPhone,
        guests: guestNumbers,
      }),
    );
    navigate("/tables");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#262626] px-2 py-1.5 h-16 flex justify-around items-center z-40 border-t border-[#333]">
      <button
        onClick={() => {
          navigate("/");
        }}
        className={`flex items-center justify-center text-[#ababab] hover:text-white ${isActive("/") ? "bg-[#343434] text-white" : "bg-transparent"} w-full max-w-[140px] sm:max-w-[180px] py-2 rounded-[20px] transition-colors`}
      >
        <FaHome className="inline mr-2 sm:mr-3 text-lg sm:text-2xl" />
        <p className="text-xs sm:text-sm font-medium">Home</p>
      </button>
      <button
        onClick={() => {
          navigate("/orders");
        }}
        className={`flex items-center justify-center text-[#ababab] hover:text-white ${isActive("/orders") ? "bg-[#343434] text-white" : "bg-transparent"} w-full max-w-[140px] sm:max-w-[180px] py-2 rounded-[20px] transition-colors`}
      >
        <MdOutlineReorder className="inline mr-2 sm:mr-3 text-lg sm:text-2xl" />
        <p className="text-xs sm:text-sm font-medium">Orders</p>
      </button>
      <button
        onClick={() => {
          navigate("/tables");
        }}
        className={`flex items-center justify-center text-[#ababab] hover:text-white ${isActive("/tables") ? "bg-[#343434] text-white" : "bg-transparent"} w-full max-w-[140px] sm:max-w-[180px] py-2 rounded-[20px] transition-colors`}
      >
        <MdTableBar className="inline mr-2 sm:mr-3 text-lg sm:text-2xl" />
        <p className="text-xs sm:text-sm font-medium">Tables</p>
      </button>
      <button
        onClick={() => {
          navigate("/more");
        }}
        className={`flex items-center justify-center text-[#ababab] hover:text-white ${isActive("/more") ? "bg-[#343434] text-white" : "bg-transparent"} w-full max-w-[140px] sm:max-w-[180px] py-2 rounded-[20px] transition-colors`}
      >
        <CiCircleMore className="inline mr-2 sm:mr-3 text-lg sm:text-2xl" />
        <p className="text-xs sm:text-sm font-medium">More</p>
      </button>
      <button
        onClick={onOpenModal}
        disabled={isActive("/tables") || isActive("/menu")}
        className="absolute items-center bottom-6 bg-[#F6B100] hover:bg-yellow-400 text-[#f5f5f5] rounded-full p-3 shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <BiSolidDish size={28} />
      </button>


      {isModalOpen && (
        <Modal title="Create Orders" onCloseModal={onCloseModal}>
          <div>
            <label
              className="block text-[#ababab] text-sm mb-2 font-medium"
              htmlFor=""
            >
              Customer Name
            </label>
            <div className="flex items-center rounded-lg px-4 p-3 bg-[#262626]">
              <input
                className="bg-transparent text-white focus:outline-none"
                type="text"
                placeholder="Enter Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              className="block text-[#ababab] text-sm mb-2 mt-3 font-medium"
              htmlFor=""
            >
              Customer Phone Number
            </label>
            <div className="flex items-center rounded-lg px-4 p-3 bg-[#262626]">
              <input
                className="bg-transparent text-white focus:outline-none"
                type="tel"
                placeholder="+880 1732-112092"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              className="block text-[#ababab] text-sm mb-2 mt-3 font-medium"
              htmlFor=""
            >
              Guests
            </label>
            <div className="flex justify-between items-center rounded-lg px-4 p-3 bg-[#262626]">
              <button
                onClick={handleGuestNumbersDecrease}
                className="bg-transparent text-white text-xl"
              >
                &minus;
              </button>
              <span className="bg-transparent text-white">
                {guestNumbers} Persons
              </span>
              <button
                onClick={handleGuestNumbersIncrease}
                className="bg-transparent text-white text-xl"
              >
                &#43;
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center bg-yellow-400/70 cursor-pointer py-3 text-white font-semibold mt-4 rounded-lg">
            <button onClick={handleCreateOrder}>Create Order</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default BottomNav;
