import React from "react";
import { FaCheckDouble, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { createAvatar } from "../../Constants";

const OrderList = ({ order }) => {
  if (!order) return null;

  const {
    customerDetails = {},
    tableNo,
    orderStatus = "In Progress",
    items = [],
    bills = {},
  } = order;

  const getStatusInfo = (status) => {
    switch (status) {
      case "Ready":
        return { color: "text-emerald-400", label: "Ready to Serve", icon: <FaCheckDouble /> };
      case "Completed":
        return { color: "text-blue-400", label: "Completed", icon: <FaCheckCircle /> };
      case "Cancelled":
        return { color: "text-red-400", label: "Cancelled", icon: <FaTimesCircle /> };
      default:
        return { color: "text-yellow-400", label: "In Kitchen", icon: <FaClock /> };
    }
  };

  const statusInfo = getStatusInfo(orderStatus);
  const totalItems = items.reduce((acc, item) => acc + Number(item.quantity || 1), 0);

  return (
    <div className="flex items-center mb-4 p-3 bg-[#1f1f1f] rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all gap-4">
      <div className="bg-yellow-500 text-black font-extrabold text-lg w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
        {createAvatar(customerDetails.name || "Customer")}
      </div>
      <div className="flex items-center justify-between w-full min-w-0">
        <div className="flex flex-col items-start gap-0.5 min-w-0">
          <h1 className="text-[#f5f5f5] text-sm font-bold truncate">
            {customerDetails.name || "Guest Customer"}
          </h1>
          <p className="text-[#ababab] text-xs">
            {totalItems} {totalItems === 1 ? "Item" : "Items"} &bull; {bills.totalWithTax || bills.total || 0} TK
          </p>
        </div>
        <div>
          <span className="text-yellow-400 text-xs font-bold border border-yellow-500/40 rounded-lg px-2.5 py-1 bg-yellow-500/10">
            Table #{tableNo || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <span className={statusInfo.color}>{statusInfo.icon}</span>
          <span className={statusInfo.color}>{statusInfo.label}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
