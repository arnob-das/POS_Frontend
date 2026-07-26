import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateTable } from "../../features/customerSlice";
import { FaUserFriends, FaCheckCircle, FaLock, FaUndo, FaPlus } from "react-icons/fa";
import API from "../../utils/api";

const bgColors = [
  "bg-blue-600",
  "bg-green-600",
  "bg-red-600",
  "bg-yellow-600",
  "bg-purple-600",
  "bg-orange-600",
  "bg-indigo-600",
  "bg-emerald-600",
];

const TableCard = ({ _id, tableNo = 1, name = "", status = "available", seats = 4, initial = "", currentOrder, onStatusChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isBooked = status === "booked" || status === "occupied" || status === "Booked";
  const displayTitle = name || `Table ${tableNo}`;
  const displayInitial = initial || (displayTitle ? displayTitle.substring(0, 2).toUpperCase() : `T${tableNo}`);
  const colorIndex = (Math.abs(Number(tableNo)) || 0) % bgColors.length;
  const avatarBg = bgColors[colorIndex];

  const handleSelectTable = () => {
    dispatch(updateTable({ tableNo: tableNo || name }));
    navigate("/menu");
  };

  const handleToggleStatus = async (e) => {
    e.stopPropagation();
    try {
      const nextStatus = isBooked ? "available" : "booked";
      await API.put(`/table/${_id}`, {
        status: nextStatus,
        currentOrder: nextStatus === "available" ? null : currentOrder?._id || currentOrder,
      });
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error("Failed to update table status:", err);
      alert(err.response?.data?.message || "Error updating table status");
    }
  };

  return (
    <div
      className={`w-full sm:w-[280px] lg:w-[300px] bg-[#2a2a2a] hover:bg-[#333] p-5 rounded-2xl border transition-all shadow-lg flex flex-col justify-between ${
        isBooked ? "border-yellow-500/40" : "border-[#3a3a3a] hover:border-yellow-500/80"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-white text-lg font-bold tracking-wide">
          {displayTitle}
        </h1>
        <button
          onClick={handleToggleStatus}
          title="Click to toggle status in database"
          className={`px-3 py-1 text-xs font-bold rounded-full capitalize flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 ${
            isBooked
              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
          }`}
        >
          {isBooked ? <FaLock className="text-xs" /> : <FaCheckCircle className="text-xs" />}
          {isBooked ? "Booked" : "Available"}
        </button>
      </div>

      {/* Center Circle */}
      <div className="flex justify-center items-center my-5">
        <div
          onClick={handleSelectTable}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-inner ${avatarBg} cursor-pointer hover:scale-105 transition-transform`}
        >
          {displayInitial}
        </div>
      </div>

      {/* Current Order details if booked */}
      {isBooked && currentOrder && (
        <div className="bg-[#1f1f1f] p-2.5 rounded-xl border border-[#333] mb-3 text-xs">
          <p className="text-gray-300 font-bold truncate">
            {currentOrder.customerDetails?.name || "Active Guest"}
          </p>
          <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1">
            <span>Bill: <strong className="text-yellow-500">{currentOrder.bills?.totalWithTax || 0} TK</strong></span>
            <span className="bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-bold">
              {currentOrder.orderStatus || "In Progress"}
            </span>
          </div>
        </div>
      )}

      {/* Footer Info & Action */}
      <div className="flex items-center justify-between pt-3 border-t border-[#3a3a3a] text-xs">
        <p className="text-gray-400 font-medium flex items-center gap-1.5">
          <FaUserFriends className="text-gray-400 text-sm" />
          {seats} Seats
        </p>

        {isBooked ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectTable}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all"
            >
              <FaPlus /> Order
            </button>
            <button
              onClick={handleToggleStatus}
              className="bg-[#1f1f1f] hover:bg-[#383838] text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
              title="Release Table / Mark Available"
            >
              <FaUndo /> Free
            </button>
          </div>
        ) : (
          <button
            onClick={handleSelectTable}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all shadow"
          >
            Assign Table
          </button>
        )}
      </div>
    </div>
  );
};

export default TableCard;
