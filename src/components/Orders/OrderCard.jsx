import React from "react";
import { useSelector } from "react-redux";
import {
  FaCheckDouble,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaReceipt,
  FaMoneyBillWave,
  FaConciergeBell,
} from "react-icons/fa";
import { createAvatar } from "../../Constants";

function OrderCard({ order, onStatusChange, onViewInvoice, onProcessPayment }) {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "staff";

  if (!order) return null;

  const {
    _id,
    orderId,
    customerDetails = {},
    tableNo,
    orderStatus = "In Progress",
    bills = {},
    items = [],
    paymentMethod = "Cash",
    paymentStatus = "Pending",
    createdAt,
  } = order;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Ready":
        return {
          bg: "bg-[#1f3a2b] text-emerald-400 border border-emerald-500/30",
          icon: <FaCheckDouble className="inline mr-1" />,
          label: "Cook Done (Ready)",
        };
      case "Served":
        return {
          bg: "bg-purple-900/40 text-purple-400 border border-purple-500/30",
          icon: <FaConciergeBell className="inline mr-1" />,
          label: "Served / Delivered",
        };
      case "Completed":
        return {
          bg: "bg-blue-900/40 text-blue-400 border border-blue-500/30",
          icon: <FaCheckCircle className="inline mr-1" />,
          label: "Completed",
        };
      case "Cancelled":
        return {
          bg: "bg-red-900/40 text-red-400 border border-red-500/30",
          icon: <FaTimesCircle className="inline mr-1" />,
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-yellow-900/40 text-yellow-400 border border-yellow-500/30",
          icon: <FaClock className="inline mr-1" />,
          label: "In Kitchen",
        };
    }
  };

  const badge = getStatusBadge(orderStatus);
  const totalItems = items.reduce((acc, i) => acc + Number(i.quantity || 1), 0);
  const dateStr = createdAt ? new Date(createdAt).toLocaleString() : "Just now";

  return (
    <div className="w-full sm:w-[350px] lg:w-[380px] bg-[#2a2a2a] p-4 rounded-2xl border border-[#3a3a3a] hover:border-yellow-500/50 transition-all shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-yellow-500 text-black font-extrabold text-lg w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md">
          {createAvatar(customerDetails.name || "Customer")}
        </div>
        <div className="flex justify-between items-start w-full min-w-0">
          <div className="min-w-0">
            <h1 className="text-[#f5f5f5] text-base font-bold truncate">
              {customerDetails.name || "Guest Customer"}
            </h1>
            <p className="text-[#ababab] text-xs font-medium truncate">
              Table #{tableNo || "N/A"} &bull; {customerDetails.phone || "No Phone"}
            </p>
          </div>
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${badge.bg} shrink-0`}>
            {badge.icon} {badge.label}
          </span>
        </div>
      </div>

      {/* Items Summary & Payment Tag */}
      <div className="flex items-center justify-between text-xs text-[#ababab] mt-4 pt-3 border-t border-[#383838]">
        <p className="font-mono text-[11px]">{dateStr}</p>
        <span className="bg-[#1f1f1f] px-2 py-0.5 rounded font-semibold text-white">
          {totalItems} {totalItems === 1 ? "Item" : "Items"}
        </span>
      </div>

      {/* Payment info tag */}
      <div className="flex justify-between items-center my-3 text-xs">
        <div className="flex items-center gap-1.5 text-gray-300">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
            <FaMoneyBillWave /> Cash Payment
          </span>
        </div>
        <span className="text-[11px] font-bold text-gray-400 uppercase">
          Status: <strong className={paymentStatus === "Paid" ? "text-emerald-400" : "text-yellow-400"}>{paymentStatus}</strong>
        </span>
      </div>

      <hr className="border-[#383838]" />

      {/* Footer & Actions */}
      <div className="flex items-center justify-between mt-3 pt-1">
        <div>
          <p className="text-xs text-gray-400 font-medium">Total Bill</p>
          <p className="text-yellow-500 text-lg font-extrabold">{bills.totalWithTax || bills.total || 0} TK</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewInvoice && onViewInvoice(order)}
            className="bg-[#1f1f1f] hover:bg-[#333] border border-[#3a3a3a] text-white p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="View & Print Receipt"
          >
            <FaReceipt className="text-yellow-500" /> Receipt
          </button>

          {/* Kitchen action */}
          {orderStatus === "In Progress" && (role === "kitchen" || role === "admin" || role === "staff") && (
            <button
              onClick={() => onStatusChange && onStatusChange(_id, "Ready")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
            >
              Cook Done
            </button>
          )}

          {/* Waiter action */}
          {orderStatus === "Ready" && (role === "waiter" || role === "staff" || role === "admin") && (
            <button
              onClick={() => onStatusChange && onStatusChange(_id, "Served")}
              className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow flex items-center gap-1"
            >
              <FaConciergeBell /> Deliver
            </button>
          )}

          {/* Cashier action */}
          {orderStatus === "Served" && (role === "cashier" || role === "admin") && (
            <button
              onClick={() => {
                if (onProcessPayment) {
                  onProcessPayment(order);
                } else if (onStatusChange) {
                  onStatusChange(_id, "Completed");
                }
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
            >
              Collect Cash
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
