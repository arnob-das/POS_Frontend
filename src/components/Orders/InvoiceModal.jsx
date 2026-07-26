import React from "react";
import { FaPrint, FaCheckCircle, FaTimes } from "react-icons/fa";
import logo from "../../assets/logo.png";

const InvoiceModal = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    orderId,
    customerDetails,
    tableNo,
    items = [],
    bills = {},
    paymentMethod = "Cash",
    paymentStatus = "Paid",
    createdAt,
  } = order;

  const dateString = createdAt
    ? new Date(createdAt).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white text-black w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-gray-200 animate-fadeIn printable-area">
        {/* Close Button - hidden in print */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl cursor-pointer"
        >
          <FaTimes />
        </button>

        {/* Invoice Header */}
        <div className="text-center border-b pb-4 mb-4">
          <div className="flex justify-center items-center gap-2 mb-1">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              RESTRO POS
            </h2>
          </div>
          <p className="text-xs text-gray-500 font-medium">123 Culinary Boulevard, Dhaka, BD</p>
          <p className="text-xs text-gray-500 font-medium">Tel: +880 1700-000000</p>
          <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase">
            Official Tax Invoice
          </div>
        </div>

        {/* Order Meta Info */}
        <div className="grid grid-cols-2 gap-2 text-xs border-b pb-3 mb-3 text-gray-700">
          <div>
            <p className="text-gray-500 font-semibold">Invoice No:</p>
            <p className="font-bold text-gray-900">{orderId || "ORD-0000"}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 font-semibold">Date & Time:</p>
            <p className="font-medium text-gray-900">{dateString}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Customer:</p>
            <p className="font-bold text-gray-900">{customerDetails?.name || "Guest"}</p>
            <p className="text-[11px] text-gray-600">{customerDetails?.phone || "N/A"}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 font-semibold">Table & Guests:</p>
            <p className="font-bold text-gray-900">
              Table #{tableNo || "N/A"} ({customerDetails?.guests || 1} Guests)
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-4">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-500 uppercase font-semibold text-[10px]">
                <th className="py-1.5">Item</th>
                <th className="py-1.5 text-center">Qty</th>
                <th className="py-1.5 text-right">Price</th>
                <th className="py-1.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item, idx) => {
                const qty = item.quantity || 1;
                const price = item.price || 0;
                return (
                  <tr key={idx} className="text-gray-800 font-medium">
                    <td className="py-2 pr-2">{item.name}</td>
                    <td className="py-2 text-center">{qty}</td>
                    <td className="py-2 text-right">{price} TK</td>
                    <td className="py-2 text-right font-bold">
                      {qty * price} TK
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="border-t pt-3 space-y-1.5 text-xs text-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal:</span>
            <span className="font-semibold">{bills.total || 0} TK</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">VAT / Tax (5%):</span>
            <span className="font-semibold">{bills.tax || 0} TK</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1 border-t">
            <span>Grand Total:</span>
            <span className="text-yellow-600 text-base">{bills.totalWithTax || bills.total} TK</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs">
          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">Payment Method</span>
            <span className="font-bold text-gray-900 capitalize flex items-center gap-1">
              <FaCheckCircle className="text-emerald-500" />
              {paymentMethod}
            </span>
          </div>
          <div className="text-right">
            <span className="text-gray-500 block text-[10px] uppercase font-bold">Payment Status</span>
            <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded text-[10px]">
              {paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Footer Greetings */}
        <div className="mt-5 text-center text-[11px] text-gray-500 border-t pt-3">
          <p className="font-semibold">Thank you for dining with us!</p>
          <p className="text-[10px]">Please come again.</p>
        </div>

        {/* Action Buttons - hidden in print */}
        <div className="no-print mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <FaPrint /> Print Invoice
          </button>
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
          >
            Close & Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
