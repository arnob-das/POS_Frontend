import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import API from "../utils/api";
import Modal from "../components/shared/Modal";
import {
  FaCashRegister,
  FaUtensils,
  FaUsers,
  FaTable,
  FaPlus,
  FaTrashAlt,
  FaShieldAlt,
  FaRedo,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "analytics", "staffs", "menu", "tables"
  const [daysFilter, setDaysFilter] = useState(7);
  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [analyticsData, setAnalyticsData] = useState({
    dailyStats: [],
    summary: {
      totalRevenue: 0,
      totalTax: 0,
      totalOrdersCount: 0,
      completedOrdersCount: 0,
      occupiedTablesCount: 0,
    },
  });

  const [tables, setTables] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & category filter for Menu Customization
  const [menuSearch, setMenuSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Add table modal
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [tableNo, setTableNo] = useState("");
  const [seats, setSeats] = useState(4);

  // Add menu item modal
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishCategory, setDishCategory] = useState("Fast Food");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, tablesRes, usersRes, menuRes] = await Promise.all([
        API.get(`/order/analytics?date=${selectedDate}&days=${daysFilter}`),
        API.get("/table"),
        API.get("/user/all").catch(() => ({ data: { data: [] } })),
        API.get("/menu"),
      ]);

      if (analyticsRes.data) {
        setAnalyticsData({
          dailyStats: analyticsRes.data.dailyStats || [],
          summary: analyticsRes.data.summary || {},
        });
      }

      setTables(tablesRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
      setMenuList(menuRes.data?.data || []);
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [daysFilter, selectedDate]);

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!tableNo) return;
    try {
      await API.post("/table", {
        tableNo: Number(tableNo),
        seats: Number(seats),
        status: "available",
      });
      setIsAddTableOpen(false);
      setTableNo("");
      setSeats(4);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add table");
    }
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;
    try {
      await API.delete(`/table/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete table");
    }
  };

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
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add dish");
    }
  };

  const handleDeleteDish = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await API.delete(`/menu/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete dish");
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await API.patch(`/user/${userId}/role`, { role: newRole });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    try {
      await API.delete(`/user/${userId}`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const maxDailySales = Math.max(
    ...analyticsData.dailyStats.map((d) => d.totalSales || 1),
    100
  );

  // Filter menu items by search and category
  const filteredMenu = menuList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Fast Food", "Main Course", "Pizza", "Beverages", "Sides", "Desserts"];

  return (
    <section className="bg-[#141414] min-h-[calc(100vh-4rem)] overflow-y-auto pb-24 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3.5 border-b border-[#2d2d2d] gap-3 bg-[#1c1c1c]">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-base sm:text-lg font-extrabold flex items-center gap-2 text-white tracking-tight">
              <FaShieldAlt className="text-amber-400" /> Admin Control Center
            </h1>
            <p className="text-[11px] text-gray-400">
              Manage analytics, staff accounts, menu items, & dining tables by tabs
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#141414] p-1.5 rounded-xl border border-[#2d2d2d] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "overview" ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "analytics" ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("staffs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "staffs" ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Staffs ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "menu" ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Menu ({menuList.length})
          </button>
          <button
            onClick={() => setActiveTab("tables")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "tables" ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Tables ({tables.length})
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-5 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs">Loading Admin Data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-400 gap-2">
            <p className="text-xs">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-[#2a2a2a] hover:bg-[#333] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <FaRedo /> Retry
            </button>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-[#1c1c1c] p-4 rounded-2xl border border-[#2a2a2a]">
                  <div>
                    <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <FaCashRegister className="text-amber-400" /> Date-wise Revenue & Table Occupancy
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">Select any date to view historical revenue and occupied tables</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#141414] border border-[#333] px-3 py-1.5 rounded-xl text-xs">
                    <FaCalendarAlt className="text-amber-400 text-xs" />
                    <span className="text-gray-400 font-semibold text-[11px]">Select Date:</span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent text-white font-extrabold outline-none cursor-pointer text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-4 shadow flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400">Total Revenue ({selectedDate})</p>
                      <h3 className="text-2xl font-extrabold text-amber-400 mt-1">
                        {analyticsData.summary.totalRevenue || 0} TK
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400 text-xl">
                      <FaCashRegister />
                    </div>
                  </div>

                  <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-4 shadow flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400">Occupied Tables ({selectedDate})</p>
                      <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
                        {analyticsData.summary.occupiedTablesCount || 0} Tables
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 text-xl">
                      <FaTable />
                    </div>
                  </div>

                  <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-4 shadow flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400">Total Bills ({selectedDate})</p>
                      <h3 className="text-2xl font-extrabold text-white mt-1">
                        {analyticsData.summary.totalOrdersCount || 0}
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 text-xl">
                      <FaUtensils />
                    </div>
                  </div>

                  <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-4 shadow flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-400">Staff Accounts Active</p>
                      <h3 className="text-2xl font-extrabold text-white mt-1">
                        {users.length}
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 text-xl">
                      <FaUsers />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DATE-WISE ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-[#1c1c1c] p-3.5 rounded-2xl border border-[#2a2a2a]">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <FaCalendarAlt className="text-amber-400" /> Multi-Day Revenue Trend
                  </h3>
                  <select
                    value={daysFilter}
                    onChange={(e) => setDaysFilter(Number(e.target.value))}
                    className="bg-[#141414] border border-[#333] text-white text-xs px-3 py-1.5 rounded-xl outline-none font-semibold cursor-pointer"
                  >
                    <option value={7}>Last 7 Days</option>
                    <option value={14}>Last 14 Days</option>
                    <option value={30}>Last 30 Days</option>
                  </select>
                </div>

                <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-5 rounded-2xl shadow">
                  <div className="flex items-end gap-3 h-44 pt-4 border-b border-[#2a2a2a] pb-2 overflow-x-auto">
                    {analyticsData.dailyStats.map((day) => {
                      const barHeightPercent = Math.max(
                        Math.round((day.totalSales / maxDailySales) * 100),
                        12
                      );
                      return (
                        <div key={day._id} className="flex-1 flex flex-col items-center min-w-[50px]">
                          <span className="text-[10px] text-amber-400 font-bold mb-1">
                            {day.totalSales} TK
                          </span>
                          <div
                            style={{ height: `${barHeightPercent}%` }}
                            className="w-full bg-gradient-to-t from-amber-600 to-yellow-400 rounded-t-lg transition-all"
                          />
                          <span className="text-[10px] text-gray-400 mt-1 font-mono">
                            {day._id.substring(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STAFFS MANAGEMENT TAB */}
            {activeTab === "staffs" && (
              <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <FaUsers className="text-amber-400" /> System Staff & Role Management ({users.length} Accounts)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a] text-gray-400 uppercase font-semibold text-[10px] bg-[#141414]">
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Phone</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-[#222222]">
                          <td className="py-2.5 px-3 font-bold text-white">{u.name}</td>
                          <td className="py-2.5 px-3 text-gray-300 font-mono">{u.email}</td>
                          <td className="py-2.5 px-3 font-mono">{u.phone}</td>
                          <td className="py-2.5 px-3">
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                              className="bg-[#141414] border border-[#333] text-amber-400 text-xs px-2 py-1 rounded font-bold outline-none cursor-pointer"
                            >
                              <option value="admin">Admin</option>
                              <option value="cashier">Cashier</option>
                              <option value="waiter">Waiter</option>
                              <option value="chef">Chef</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-1.5 rounded-lg border border-red-500/30 transition-all cursor-pointer text-xs"
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

            {/* MENU CUSTOMIZATION TAB */}
            {activeTab === "menu" && (
              <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#2a2a2a] pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <FaUtensils className="text-amber-400" /> Menu Customization Page ({filteredMenu.length} of {menuList.length} Dishes)
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Filter by category or search all dishes</p>
                  </div>
                  <button
                    onClick={() => setIsAddMenuOpen(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
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
                    No menu items found matching search or category.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredMenu.map((dish) => (
                      <div
                        key={dish._id}
                        className="bg-[#141414] border border-[#2a2a2a] p-3 rounded-xl flex justify-between items-center shadow hover:border-amber-500/30 transition-all"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-white">{dish.name}</h4>
                          <p className="text-xs text-amber-400 font-black mt-0.5">{dish.price} TK</p>
                          <span className="text-[9px] font-bold text-gray-400 bg-[#242424] px-2 py-0.5 rounded mt-1 inline-block">
                            {dish.category}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteDish(dish._id)}
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-1.5 rounded-lg border border-red-500/30 transition-all cursor-pointer text-xs"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABLES TAB */}
            {activeTab === "tables" && (
              <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-3">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <FaTable className="text-amber-400" /> Dining Tables Management
                  </h3>
                  <button
                    onClick={() => setIsAddTableOpen(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <FaPlus /> Add Table
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {tables.map((table) => (
                    <div
                      key={table._id}
                      className="bg-[#141414] border border-[#2a2a2a] p-3 rounded-xl flex justify-between items-center shadow hover:border-amber-500/30 transition-all"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">Table #{table.tableNo}</h4>
                        <p className="text-[10px] text-gray-400">{table.seats} Seats</p>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded capitalize mt-1 inline-block ${
                            table.status === "available" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {table.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteTable(table._id)}
                        className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-1.5 rounded-lg border border-red-500/30 transition-all cursor-pointer text-xs"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Table Modal */}
      {isAddTableOpen && (
        <Modal title="Add New Dining Table" onCloseModal={() => setIsAddTableOpen(false)}>
          <form onSubmit={handleAddTable} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Table Number *
              </label>
              <input
                type="number"
                required
                min={1}
                value={tableNo}
                onChange={(e) => setTableNo(e.target.value)}
                placeholder="e.g. 10"
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3 py-2 text-xs rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Seating Capacity
              </label>
              <input
                type="number"
                required
                min={1}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3 py-2 text-xs rounded-lg outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 text-xs rounded-lg transition-all shadow cursor-pointer"
            >
              Save Table
            </button>
          </form>
        </Modal>
      )}

      {/* Add Menu Item Modal */}
      {isAddMenuOpen && (
        <Modal title="Add New Menu Dish" onCloseModal={() => setIsAddMenuOpen(false)}>
          <form onSubmit={handleAddDish} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Dish Name *</label>
              <input
                type="text"
                required
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g. Garlic Naan"
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3 py-2 text-xs rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Price (TK) *</label>
              <input
                type="number"
                required
                min={0}
                value={dishPrice}
                onChange={(e) => setDishPrice(e.target.value)}
                placeholder="e.g. 180"
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-3 py-2 text-xs rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
              <select
                value={dishCategory}
                onChange={(e) => setDishCategory(e.target.value)}
                className="w-full bg-[#141414] border border-[#333] focus:border-amber-500 text-white px-2 py-2 text-xs rounded-lg outline-none"
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
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 text-xs rounded-lg transition-all shadow cursor-pointer"
            >
              Save Menu Dish
            </button>
          </form>
        </Modal>
      )}

      <BottomNav />
    </section>
  );
};

export default AdminDashboard;
