import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import InvoiceModal from "../components/Orders/InvoiceModal";
import Modal from "../components/shared/Modal";
import API from "../utils/api";
import { setCustomer, updateTable } from "../features/customerSlice";
import {
  FaCashRegister,
  FaTable,
  FaUsers,
  FaCalendarAlt,
  FaUtensils,
  FaPlus,
  FaTrashAlt,
  FaCheckCircle,
  FaConciergeBell,
  FaReceipt,
  FaClock,
  FaPhoneAlt,
  FaUser,
  FaSearch,
} from "react-icons/fa";

function Home() {
  const { user } = useSelector((state) => state.auth);
  const rawRole = user?.role || "waiter";
  const role =
    rawRole === "chef" || rawRole === "kitchen"
      ? "chef"
      : rawRole === "staff"
        ? "waiter"
        : rawRole;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Admin Active Tab
  const [adminTab, setAdminTab] = useState("overview"); // "overview", "staffs", "menu", "tables"

  // Date selection filter for Admin
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Admin Data states
  const [salesSummary, setSalesSummary] = useState({
    totalRevenue: 0,
    occupiedTablesCount: 0,
    totalOrdersCount: 0,
  });
  const [staffsList, setStaffsList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [tablesList, setTablesList] = useState([]);

  // Search & Category filter for Menu Tab
  const [menuSearch, setMenuSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Queue orders
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custGuests, setCustGuests] = useState(2);
  const [selectedTableNo, setSelectedTableNo] = useState("");

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishCategory, setDishCategory] = useState("Fast Food");

  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableNo, setNewTableNo] = useState("");
  const [newSeats, setNewSeats] = useState(4);

  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      if (role === "admin") {
        const [analyticsRes, usersRes, menuRes, tablesRes] = await Promise.all([
          API.get(`/order/analytics?date=${selectedDate}`),
          API.get("/user/all").catch(() => ({ data: { data: [] } })),
          API.get("/menu"),
          API.get("/table"),
        ]);

        if (analyticsRes.data?.summary) {
          setSalesSummary({
            totalRevenue: analyticsRes.data.summary.totalRevenue || 0,
            occupiedTablesCount:
              analyticsRes.data.summary.occupiedTablesCount || 0,
            totalOrdersCount: analyticsRes.data.summary.totalOrdersCount || 0,
          });
        }
        setStaffsList(usersRes.data?.data || []);
        setMenuList(menuRes.data?.data || []);
        setTablesList(tablesRes.data?.data || []);
      } else if (role === "waiter") {
        const tablesRes = await API.get("/table");
        setTablesList(tablesRes.data?.data || []);
      }

      // Fetch live orders for Kitchen, Waiter, Cashier queues
      const ordersRes = await API.get("/order");
      setActiveOrders(ordersRes.data?.data || []);
    } catch (err) {
      console.error("Home Data Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [role, selectedDate]);

  // Order Placement trigger
  const handleStartOrder = (e) => {
    e.preventDefault();
    if (!custName || !custPhone || !selectedTableNo) {
      alert("Please fill in Customer Name, Phone, and select a Table!");
      return;
    }
    dispatch(
      setCustomer({
        name: custName,
        phone: custPhone,
        guests: Number(custGuests),
      }),
    );
    dispatch(updateTable({ tableNo: Number(selectedTableNo) }));
    setIsOrderModalOpen(false);
    navigate("/menu");
  };

  // Staff management
  const handleUpdateRole = async (userId, newRole) => {
    try {
      await API.patch(`/user/${userId}/role`, { role: newRole });
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update staff role");
    }
  };

  const handleDeleteStaff = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this staff member?"))
      return;
    try {
      await API.delete(`/user/${userId}`);
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete staff member");
    }
  };

  // Menu management
  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!dishName || !dishPrice) return;
    try {
      await API.post("/menu", {
        name: dishName,
        price: Number(dishPrice),
        category: dishCategory,
      });
      setIsAddMenuOpen(false);
      setDishName("");
      setDishPrice("");
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add dish");
    }
  };

  const handleDeleteDish = async (dishId) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await API.delete(`/menu/${dishId}`);
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete dish");
    }
  };

  // Table management
  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableNo) return;
    try {
      await API.post("/table", {
        tableNo: Number(newTableNo),
        seats: Number(newSeats),
        status: "available",
      });
      setIsAddTableOpen(false);
      setNewTableNo("");
      setNewSeats(4);
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add table");
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;
    try {
      await API.delete(`/table/${tableId}`);
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete table");
    }
  };

  // Order status transitions
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.put(`/order/${orderId}`, { orderStatus: newStatus });
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const handleCashierComplete = async (orderId) => {
    try {
      await API.put(`/order/${orderId}`, {
        orderStatus: "Completed",
        paymentStatus: "Paid",
        paymentMethod: "Cash",
      });
      setSelectedReceiptOrder(null);
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete order checkout");
    }
  };

  // Filter queues
  const kitchenQueue = activeOrders.filter(
    (o) => o.orderStatus === "In Progress",
  );
  const readyForDeliveryQueue = activeOrders.filter(
    (o) => o.orderStatus === "Ready",
  );
  const cashierBillingQueue = activeOrders.filter(
    (o) => o.orderStatus === "Served",
  );

  // Filtered Menu List
  const filteredMenu = menuList.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(menuSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    "Fast Food",
    "Main Course",
    "Pizza",
    "Beverages",
    "Sides",
    "Desserts",
  ];

  return (
    <section className="bg-[#141414] min-h-[calc(100vh-4rem)] overflow-y-auto pb-24 text-white font-sans">
      {/* Top Banner Header */}
      <div className="bg-[#1c1c1c] border-b border-[#2a2a2a] px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2 tracking-tight">
              Operational Workspace
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {role} View
              </span>
            </h1>
            <p className="text-[11px] text-gray-400">
              Active User:{" "}
              <strong className="text-gray-200">
                {user?.name || "Staff Member"}
              </strong>{" "}
              ({user?.email})
            </p>
          </div>
        </div>

        {/* Action Button: Take Order for Waiter / Admin */}
        {(role === "waiter" || role === "admin") && (
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <FaPlus className="text-xs" /> Take New Dining Order
          </button>
        )}
      </div>

      <div className="px-4 sm:px-8 py-5 max-w-7xl mx-auto space-y-5">
        {/* ==================== 1. ADMIN TABBED VIEW ==================== */}
        {role === "admin" && (
          <div className="space-y-4">
            {/* Admin Segmented Tabs */}
            <div className="flex bg-[#1c1c1c] p-1.5 rounded-2xl border border-[#2a2a2a] overflow-x-auto scrollbar-none shadow-md">
              <button
                onClick={() => setAdminTab("overview")}
                className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  adminTab === "overview"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-[#252525]"
                }`}
              >
                <FaCashRegister /> Sales & Revenue
              </button>
              <button
                onClick={() => setAdminTab("staffs")}
                className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  adminTab === "staffs"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-[#252525]"
                }`}
              >
                <FaUsers /> Staff Management ({staffsList.length})
              </button>
              <button
                onClick={() => setAdminTab("menu")}
                className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  adminTab === "menu"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-[#252525]"
                }`}
              >
                <FaUtensils /> Menu Customization ({menuList.length})
              </button>
              <button
                onClick={() => setAdminTab("tables")}
                className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  adminTab === "tables"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-[#252525]"
                }`}
              >
                <FaTable /> Table Customization ({tablesList.length})
              </button>
            </div>

            {/* TAB 1: OVERVIEW & DATE-WISE SALES */}
            {adminTab === "overview" && (
              <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                      <FaCashRegister className="text-amber-400" /> Executive
                      Revenue & Occupancy Report
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Filter sales metrics by calendar date
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-[#141414] border border-[#333] px-3 py-1.5 rounded-xl text-xs shadow-inner">
                    <FaCalendarAlt className="text-amber-400 text-xs" />
                    <span className="text-gray-400 font-semibold text-[11px]">
                      Select Date:
                    </span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent text-white font-extrabold outline-none cursor-pointer text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#141414] border border-[#2a2a2a] p-4 rounded-xl flex items-center justify-between shadow-inner hover:border-amber-500/30 transition-all">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400">
                        Total Sales Revenue ({selectedDate})
                      </p>
                      <h3 className="text-2xl font-black text-amber-400 mt-1">
                        {salesSummary.totalRevenue}{" "}
                        <span className="text-xs text-gray-400 font-bold">
                          TK
                        </span>
                      </h3>
                      <p className="text-[10px] text-emerald-400 font-medium mt-1">
                        Includes 5% Tax Collection
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400 text-xl shadow">
                      <FaCashRegister />
                    </div>
                  </div>

                  <div className="bg-[#141414] border border-[#2a2a2a] p-4 rounded-xl flex items-center justify-between shadow-inner hover:border-emerald-500/30 transition-all">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400">
                        Occupied Tables & Bills
                      </p>
                      <h3 className="text-2xl font-black text-emerald-400 mt-1">
                        {salesSummary.occupiedTablesCount}{" "}
                        <span className="text-xs text-gray-400 font-bold">
                          Tables
                        </span>
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">
                        {salesSummary.totalOrdersCount} Total Customer Bills
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 text-xl shadow">
                      <FaTable />
                    </div>
                  </div>

                  <div className="bg-[#141414] border border-[#2a2a2a] p-4 rounded-xl flex items-center justify-between shadow-inner hover:border-purple-500/30 transition-all">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400">
                        System Staff Accounts
                      </p>
                      <h3 className="text-2xl font-black text-white mt-1">
                        {staffsList.length}{" "}
                        <span className="text-xs text-gray-400 font-bold font-normal">
                          System Accounts
                        </span>
                      </h3>
                      <p className="text-[10px] text-purple-400 font-medium mt-1">
                        Admin, Cashier, Waiter, Chef
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 text-xl shadow">
                      <FaUsers />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STAFF MANAGEMENT */}
            {adminTab === "staffs" && (
              <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <FaUsers className="text-amber-400" /> System Staff
                      Management ({staffsList.length} Accounts)
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Role permissions matrix: Admin, Cashier, Waiter, Chef
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a] text-gray-400 uppercase font-extrabold text-[10px] bg-[#141414]">
                        <th className="py-3 px-3">Staff Name</th>
                        <th className="py-3 px-3">Email Address</th>
                        <th className="py-3 px-3">Phone Number</th>
                        <th className="py-3 px-3">System Role</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                      {staffsList.map((st) => (
                        <tr
                          key={st._id}
                          className="hover:bg-[#222222] transition-colors"
                        >
                          <td className="py-3 px-3 font-extrabold text-white">
                            {st.name}
                          </td>
                          <td className="py-3 px-3 text-gray-300 font-mono">
                            {st.email}
                          </td>
                          <td className="py-3 px-3 font-mono">{st.phone}</td>
                          <td className="py-3 px-3">
                            <select
                              value={st.role}
                              onChange={(e) =>
                                handleUpdateRole(st._id, e.target.value)
                              }
                              className="bg-[#141414] border border-[#333] text-amber-400 text-xs px-2.5 py-1 rounded-lg font-bold outline-none cursor-pointer focus:border-amber-500"
                            >
                              <option value="admin">Admin</option>
                              <option value="cashier">Cashier</option>
                              <option value="waiter">Waiter</option>
                              <option value="chef">Chef</option>
                            </select>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteStaff(st._id)}
                              className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-lg border border-red-500/30 transition-all cursor-pointer text-xs"
                              title="Delete Account"
                            >
                              <FaTrashAlt />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: MENU CUSTOMIZATION */}
            {adminTab === "menu" && (
              <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#2a2a2a] pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <FaUtensils className="text-amber-400" /> Restaurant Menu
                      Catalog ({filteredMenu.length} of {menuList.length}{" "}
                      Dishes)
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Customize food dishes, prices, and categories
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddMenuOpen(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <FaPlus /> Add New Dish
                  </button>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] px-3 py-2 rounded-xl text-xs flex-1">
                    <FaSearch className="text-gray-400 text-xs shrink-0" />
                    <input
                      type="text"
                      placeholder="Search dish name..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="bg-transparent text-white outline-none w-full"
                    />
                  </div>

                  <div className="flex bg-[#141414] p-1 rounded-xl border border-[#2a2a2a] overflow-x-auto scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          selectedCategory === cat
                            ? "bg-amber-500 text-black font-extrabold"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredMenu.length === 0 ? (
                  <div className="bg-[#141414] border border-[#262626] p-8 rounded-xl text-center text-gray-400 text-xs">
                    No menu items found matching search or category filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredMenu.map((dish) => (
                      <div
                        key={dish._id}
                        className="bg-[#141414] border border-[#2a2a2a] p-3.5 rounded-xl flex justify-between items-center shadow hover:border-amber-500/30 transition-all"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            {dish.name}
                          </h4>
                          <p className="text-xs text-amber-400 font-black mt-0.5">
                            {dish.price} TK
                          </p>
                          <span className="text-[9px] font-bold text-gray-400 bg-[#242424] border border-[#333] px-2 py-0.5 rounded-md mt-1 inline-block">
                            {dish.category}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteDish(dish._id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-lg border border-red-500/30 transition-all cursor-pointer text-xs"
                          title="Delete Dish"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TABLE CUSTOMIZATION */}
            {adminTab === "tables" && (
              <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <FaTable className="text-amber-400" /> Dining Tables
                      Layout
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Configure restaurant dining table availability and
                      capacity
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddTableOpen(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <FaPlus /> Add Dining Table
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {tablesList.map((t) => (
                    <div
                      key={t._id}
                      className="bg-[#141414] border border-[#2a2a2a] p-3 rounded-xl flex justify-between items-center shadow hover:border-amber-500/30 transition-all"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">
                          Table #{t.tableNo}
                        </h4>
                        <p className="text-[10px] text-gray-400">
                          {t.seats} Seats
                        </p>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded capitalize mt-1 inline-block ${
                            t.status === "available"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteTable(t._id)}
                        className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-1.5 rounded-lg border border-red-500/30 transition-all cursor-pointer text-xs"
                        title="Delete Table"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 2. CHEF / KITCHEN VIEW ONLY ==================== */}
        {role === "chef" && (
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-3">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <FaUtensils className="text-amber-400" /> Chef Display System
                  (Cooking Queue)
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Real-time incoming dish orders awaiting cooking
                </p>
              </div>
              <span className="bg-amber-500/20 text-amber-400 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-500/30">
                {kitchenQueue.length} Active Orders
              </span>
            </div>

            {kitchenQueue.length === 0 ? (
              <div className="bg-[#141414] border border-[#262626] p-10 rounded-xl text-center text-gray-400 text-xs">
                No orders pending in the kitchen display system right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kitchenQueue.map((ord) => (
                  <div
                    key={ord._id}
                    className="bg-[#141414] border border-[#2d2d2d] p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-lg hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start border-b border-[#242424] pb-2">
                      <div>
                        <h3 className="text-sm font-black text-white">
                          Table #{ord.tableNo}
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          {ord.customerDetails?.name}
                        </p>
                      </div>
                      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-extrabold">
                        In Progress
                      </span>
                    </div>

                    <div className="space-y-1.5 py-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Food Items Ordered:
                      </p>
                      <div className="space-y-1">
                        {ord.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-xs text-gray-200 bg-[#202020] px-2.5 py-1.5 rounded-lg border border-[#2a2a2a]"
                          >
                            <span>{it.name}</span>
                            <span className="font-extrabold text-amber-400">
                              x{it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOrderStatusUpdate(ord._id, "Ready")}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer transform hover:scale-[1.02]"
                    >
                      <FaCheckCircle /> Mark Cooking Finished (Cook Done)
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. WAITER VIEW ONLY ==================== */}
        {role === "waiter" && (
          <div className="space-y-4">
            {/* Quick Action Dashboard Header */}
            <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-4 rounded-2xl flex justify-between items-center shadow-lg">
              <div>
                <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <FaConciergeBell className="text-amber-400" /> Waiter Table
                  Delivery Operations
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Take new dining orders or deliver ready cooked food directly
                  to tables
                </p>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all transform hover:scale-105"
              >
                <FaPlus /> Take New Order
              </button>
            </div>

            {/* Cooked Food Delivery Queue */}
            <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-3">
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <FaCheckCircle /> Ready for Table Delivery Queue (Cook Done)
                </h3>
                <span className="bg-emerald-500/20 text-emerald-400 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {readyForDeliveryQueue.length} Dishes Ready
                </span>
              </div>

              {readyForDeliveryQueue.length === 0 ? (
                <div className="bg-[#141414] border border-[#262626] p-8 rounded-xl text-center text-gray-400 text-xs">
                  No cooked dishes currently waiting for table delivery.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {readyForDeliveryQueue.map((ord) => (
                    <div
                      key={ord._id}
                      className="bg-[#141414] border border-emerald-500/30 p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-lg"
                    >
                      <div className="flex justify-between items-start border-b border-[#242424] pb-2">
                        <div>
                          <h4 className="text-sm font-extrabold text-white">
                            Table #{ord.tableNo}
                          </h4>
                          <p className="text-[11px] text-gray-400">
                            {ord.customerDetails?.name}
                          </p>
                        </div>
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-extrabold">
                          Cook Done
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-gray-300">
                        {ord.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between bg-[#202020] px-2.5 py-1 rounded-lg border border-[#262626]"
                          >
                            <span>{it.name}</span>
                            <span className="font-bold text-white">
                              x{it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          handleOrderStatusUpdate(ord._id, "Served")
                        }
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer transform hover:scale-[1.02]"
                      >
                        <FaConciergeBell /> Deliver Food to Customer (Served)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== 4. CASHIER VIEW ONLY ==================== */}
        {role === "cashier" && (
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-3">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <FaReceipt className="text-amber-400" /> Cashier Payment Receipt
                & Billing Counter
              </h2>
              <span className="bg-purple-500/20 text-purple-400 font-extrabold text-xs px-3 py-1 rounded-full border border-purple-500/30">
                {cashierBillingQueue.length} Pending Bills
              </span>
            </div>

            {cashierBillingQueue.length === 0 ? (
              <div className="bg-[#141414] border border-[#262626] p-10 rounded-xl text-center text-gray-400 text-xs">
                No served tables waiting for payment receipt checkout right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cashierBillingQueue.map((ord) => (
                  <div
                    key={ord._id}
                    className="bg-[#141414] border border-[#2d2d2d] p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-lg"
                  >
                    <div className="flex justify-between items-start border-b border-[#242424] pb-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-white">
                          Table #{ord.tableNo}
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          {ord.customerDetails?.name}
                        </p>
                      </div>
                      <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded text-[10px] font-extrabold">
                        Served
                      </span>
                    </div>

                    <div className="bg-[#202020] p-2.5 rounded-lg border border-[#2a2a2a] flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-semibold">
                        Bill Amount:
                      </span>
                      <span className="text-amber-400 font-black text-sm">
                        {ord.bills?.totalWithTax || 0} TK
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReceiptOrder(ord)}
                        className="bg-[#242424] hover:bg-[#303030] text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-[#333] transition-colors"
                      >
                        <FaReceipt className="text-amber-400" /> Receipt
                      </button>
                      <button
                        onClick={() => handleCashierComplete(ord._id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer transform hover:scale-[1.02]"
                      >
                        <FaCheckCircle /> Cash Received & Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TAKE NEW ORDER MODAL */}
      {isOrderModalOpen && (
        <Modal
          title="Take New Dining Order"
          onCloseModal={() => setIsOrderModalOpen(false)}
        >
          <form onSubmit={handleStartOrder} className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center gap-1">
                <FaUser className="text-amber-400 text-[10px]" /> Customer Name
                *
              </label>
              <input
                type="text"
                required
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="Guest Customer Name"
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3.5 py-2.5 text-xs rounded-xl outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center gap-1">
                <FaPhoneAlt className="text-amber-400 text-[10px]" /> Customer
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                placeholder="01712345678"
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3.5 py-2.5 text-xs rounded-xl outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Guests Count
                </label>
                <input
                  type="number"
                  min={1}
                  value={custGuests}
                  onChange={(e) => setCustGuests(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3.5 py-2.5 text-xs rounded-xl outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Select Table *
                </label>
                <select
                  required
                  value={selectedTableNo}
                  onChange={(e) => setSelectedTableNo(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-2.5 py-2.5 text-xs rounded-xl outline-none transition-all cursor-pointer font-bold"
                >
                  <option value="">Choose Table</option>
                  {tablesList.map((t) => (
                    <option key={t._id} value={t.tableNo}>
                      Table #{t.tableNo} ({t.seats} seats) - {t.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black py-3 text-xs rounded-xl transition-all shadow-lg cursor-pointer transform hover:scale-[1.01] mt-2"
            >
              Proceed to Menu & Take Order
            </button>
          </form>
        </Modal>
      )}

      {/* ADD MENU ITEM MODAL */}
      {isAddMenuOpen && (
        <Modal
          title="Add New Menu Dish"
          onCloseModal={() => setIsAddMenuOpen(false)}
        >
          <form onSubmit={handleAddDish} className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Dish Name *
              </label>
              <input
                type="text"
                required
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g. Chicken Biryani"
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3.5 py-2.5 text-xs rounded-xl outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Price (TK) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={dishPrice}
                onChange={(e) => setDishPrice(e.target.value)}
                placeholder="e.g. 280"
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3.5 py-2.5 text-xs rounded-xl outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Category
              </label>
              <select
                value={dishCategory}
                onChange={(e) => setDishCategory(e.target.value)}
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3 py-2.5 text-xs rounded-xl outline-none font-bold cursor-pointer"
              >
                <option value="Fast Food">Fast Food</option>
                <option value="Main Course">Main Course</option>
                <option value="Pizza">Pizza</option>
                <option value="Beverages">Beverages</option>
                <option value="Sides">Sides</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black py-3 text-xs rounded-xl transition-all shadow-lg cursor-pointer mt-1"
            >
              Save Menu Dish
            </button>
          </form>
        </Modal>
      )}

      {/* ADD TABLE MODAL */}
      {isAddTableOpen && (
        <Modal
          title="Add New Dining Table"
          onCloseModal={() => setIsAddTableOpen(false)}
        >
          <form onSubmit={handleAddTable} className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Table Number *
              </label>
              <input
                type="number"
                required
                min={1}
                value={newTableNo}
                onChange={(e) => setNewTableNo(e.target.value)}
                placeholder="e.g. 10"
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3.5 py-2.5 text-xs rounded-xl outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Seating Capacity
              </label>
              <input
                type="number"
                required
                min={1}
                value={newSeats}
                onChange={(e) => setNewSeats(e.target.value)}
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3.5 py-2.5 text-xs rounded-xl outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black py-3 text-xs rounded-xl transition-all shadow-lg cursor-pointer mt-1"
            >
              Create Dining Table
            </button>
          </form>
        </Modal>
      )}

      {/* INVOICE RECEIPT MODAL */}
      {selectedReceiptOrder && (
        <InvoiceModal
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}

      <BottomNav />
    </section>
  );
}

export default Home;
