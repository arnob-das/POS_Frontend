import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/Orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import InvoiceModal from "../components/Orders/InvoiceModal";
import API from "../utils/api";
import {
  FaRedo,
  FaSearch,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaMoneyBillWave,
  FaCreditCard,
  FaMobileAlt,
} from "react-icons/fa";

function Orders() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "staff";

  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Payment process modal state
  const [payingOrder, setPayingOrder] = useState(null);
  const [payMethod, setPayMethod] = useState("Cash");
  const [processingPay, setProcessingPay] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/order");
      setOrdersList(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(err.response?.data?.message || "Failed to load orders from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, statusFilter, paymentFilter, searchQuery]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/order/${orderId}`, { orderStatus: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const handleConfirmPayment = async () => {
    if (!payingOrder) return;
    setProcessingPay(true);
    try {
      await API.post("/payment/process", {
        orderId: payingOrder._id,
        paymentMethod: payMethod,
      });
      setPayingOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete payment");
    } finally {
      setProcessingPay(false);
    }
  };

  // Filter orders by Status, Payment, Search, AND Date
  const filteredOrders = ordersList.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ||
      order.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

    const matchesPayment =
      paymentFilter === "all" ||
      order.paymentMethod?.toLowerCase() === paymentFilter.toLowerCase() ||
      order.paymentStatus?.toLowerCase() === paymentFilter.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      order.customerDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerDetails?.phone?.includes(searchQuery) ||
      order.tableNo?.toString().includes(searchQuery) ||
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (selectedDate && order.createdAt) {
      const orderDateStr = new Date(order.createdAt).toISOString().split("T")[0];
      matchesDate = orderDateStr === selectedDate;
    }

    return matchesStatus && matchesPayment && matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-4 sm:px-8 py-3 shrink-0 border-b border-[#2a2a2a] gap-3">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wide flex items-center gap-2">
              Live Orders
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                role === "admin"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : role === "cashier"
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              }`}>
                {role} View
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              {role === "cashier"
                ? "Cashier Billing & Paid/Pending Invoice Audit"
                : role === "admin"
                ? "Admin Complete Order Audit"
                : "Active Dining Orders & Serving Queue"}
            </p>
          </div>
        </div>

        {/* Filters Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Date Selector Filter */}
          <div className="flex items-center gap-1.5 bg-[#141414] border border-[#2a2a2a] px-3 py-1.5 rounded-xl text-xs">
            <FaCalendarAlt className="text-yellow-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white outline-none text-xs cursor-pointer"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-gray-400 hover:text-white text-xs ml-1"
                title="Clear Date Filter"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] px-3 py-1.5 rounded-xl text-xs w-full sm:w-48">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search order/phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white outline-none w-full"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex bg-[#141414] p-1 rounded-xl border border-[#2a2a2a]">
            {["all", "in progress", "ready", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === st ? "bg-[#383838] text-white font-bold" : "text-[#ababab] hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment Method Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#141414] border border-[#2a2a2a] text-white text-xs px-2.5 py-1.5 rounded-xl outline-none cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="digital wallet">Wallet</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 px-4 sm:px-8 py-4 overflow-y-auto scrollbar-none pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Loading Orders from Backend API...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-400 gap-3">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <FaRedo /> Retry Connection
            </button>
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-base font-medium">No orders found for selected date/filters.</p>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="mt-3 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-xl hover:bg-yellow-500/20"
              >
                View All Dates
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order._id || order.orderId}
                  order={order}
                  onStatusChange={handleStatusChange}
                  onProcessPayment={(ord) => setPayingOrder(ord)}
                  onViewInvoice={(ord) => setSelectedInvoiceOrder(ord)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center bg-[#141414] border border-[#2a2a2a] px-6 py-3 rounded-2xl max-w-xl mx-auto my-4 text-xs">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="flex items-center gap-1 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold"
                >
                  <FaChevronLeft /> Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pg
                          ? "bg-yellow-500 text-black shadow"
                          : "bg-[#262626] text-gray-400 hover:text-white"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="flex items-center gap-1 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-semibold"
                >
                  Next <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Processing Modal */}
      {payingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#242424] border border-[#383838] text-white w-full max-w-sm rounded-2xl p-6 relative space-y-4">
            <button
              onClick={() => setPayingOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
            <h2 className="text-lg font-bold">Process Payment & Complete</h2>
            <div className="text-xs text-gray-300 space-y-1 bg-[#1a1a1a] p-3 rounded-xl">
              <p>Customer: <strong className="text-white">{payingOrder.customerDetails?.name}</strong></p>
              <p>Table: <strong className="text-white">#{payingOrder.tableNo}</strong></p>
              <p>Total Bill: <strong className="text-yellow-500 text-sm">{payingOrder.bills?.totalWithTax} TK</strong></p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPayMethod("Cash")}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border ${
                    payMethod === "Cash" ? "bg-yellow-500 text-black border-yellow-500" : "bg-[#1a1a1a] border-[#333] text-gray-400"
                  }`}
                >
                  <FaMoneyBillWave /> Cash
                </button>
                <button
                  onClick={() => setPayMethod("Card")}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border ${
                    payMethod === "Card" ? "bg-blue-600 text-white border-blue-500" : "bg-[#1a1a1a] border-[#333] text-gray-400"
                  }`}
                >
                  <FaCreditCard /> Card
                </button>
                <button
                  onClick={() => setPayMethod("Digital Wallet")}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border ${
                    payMethod === "Digital Wallet" ? "bg-purple-600 text-white border-purple-500" : "bg-[#1a1a1a] border-[#333] text-gray-400"
                  }`}
                >
                  <FaMobileAlt /> Wallet
                </button>
              </div>
            </div>
            <button
              onClick={handleConfirmPayment}
              disabled={processingPay}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow"
            >
              {processingPay ? "Completing..." : "Confirm Payment & Complete Order"}
            </button>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      <BottomNav />
    </section>
  );
}

export default Orders;
