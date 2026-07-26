import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
import API from "../../utils/api";
import { Link } from "react-router-dom";

function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/order?limit=10");
        setOrders(res.data?.data || []);
      } catch (e) {
        console.error("Failed to load recent orders", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((ord) => {
    if (!search) return true;
    return (
      ord.customerDetails?.name?.toLowerCase().includes(search.toLowerCase()) ||
      ord.tableNo?.toString().includes(search)
    );
  });

  return (
    <div className="px-8 mt-6">
      <div className="bg-[#1a1a1a] w-full min-h-[420px] rounded-2xl border border-[#2a2a2a] p-4">
        <div className="flex justify-between items-center px-2 py-2 mb-3">
          <h1 className="text-[#f5f5f5] text-lg font-bold tracking-wide">
            Recent Orders
          </h1>
          <Link to="/orders" className="text-yellow-500 hover:underline text-xs font-bold">
            View All Orders &rarr;
          </Link>
        </div>

        <div className="flex items-center gap-3 bg-[#1f1f1f] px-4 py-2 rounded-xl mb-4 border border-[#2a2a2a]">
          <FaSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search recent orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-[#f5f5f5] text-xs w-full"
          />
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
          {loading ? (
            <div className="text-center py-10 text-xs text-gray-400">Loading recent orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-400">No recent orders recorded yet.</div>
          ) : (
            filteredOrders.map((ord) => (
              <OrderList key={ord._id || ord.orderId} order={ord} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentOrders;
