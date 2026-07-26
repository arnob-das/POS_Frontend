import { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/Tables/TableCard";
import Modal from "../components/shared/Modal";
import API from "../utils/api";
import { FaPlus, FaRedo } from "react-icons/fa";

const Tables = () => {
  const [status, setStatus] = useState("all");
  const [tablesList, setTablesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Table Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTableNo, setNewTableNo] = useState("");
  const [newSeats, setNewSeats] = useState(4);
  const [submitting, setSubmitting] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/table");
      let data = response.data?.data || [];

      // If database has no tables yet, automatically seed 8 default tables for smooth demo
      if (data.length === 0) {
        const seedPromises = Array.from({ length: 8 }, (_, i) =>
          API.post("/table", {
            tableNo: i + 1,
            seats: 4,
            status: "available",
            name: `Table ${i + 1}`,
          })
        );
        await Promise.all(seedPromises);
        const refetch = await API.get("/table");
        data = refetch.data?.data || [];
      }

      setTablesList(data);
    } catch (err) {
      console.error("Failed to load tables:", err);
      setError(err.response?.data?.message || "Failed to load tables from backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableNo) return;
    setSubmitting(true);
    try {
      await API.post("/table", {
        tableNo: Number(newTableNo),
        seats: Number(newSeats),
        status: "available",
      });
      setIsAddModalOpen(false);
      setNewTableNo("");
      setNewSeats(4);
      fetchTables();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding table");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTables = tablesList.filter((table) => {
    if (status === "all") return true;
    if (status === "booked") return table.status === "booked" || table.status === "occupied";
    if (status === "available") return table.status === "available";
    return true;
  });

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 shrink-0 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wide">
              Restaurant Tables
            </h1>
            <p className="text-xs text-gray-400">Select a table to assign current order</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#141414] p-1 rounded-xl border border-[#2a2a2a]">
            <button
              onClick={() => setStatus("all")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                status === "all" ? "bg-[#383838] text-white" : "text-[#ababab] hover:text-white"
              }`}
            >
              All ({tablesList.length})
            </button>
            <button
              onClick={() => setStatus("available")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                status === "available" ? "bg-[#383838] text-emerald-400" : "text-[#ababab] hover:text-white"
              }`}
            >
              Available ({tablesList.filter((t) => t.status === "available").length})
            </button>
            <button
              onClick={() => setStatus("booked")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                status === "booked" ? "bg-[#383838] text-yellow-400" : "text-[#ababab] hover:text-white"
              }`}
            >
              Booked ({tablesList.filter((t) => t.status === "booked" || t.status === "occupied").length})
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <FaPlus /> <span className="hidden sm:inline">Add Table</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 px-4 sm:px-8 py-6 overflow-y-auto scrollbar-none pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Loading Tables from Backend API...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-400 gap-3">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={fetchTables}
              className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <FaRedo /> Retry Connection
            </button>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-base font-medium">No tables match the selected status filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
            {filteredTables.map((table) => (
              <TableCard
                key={table._id || table.tableNo}
                _id={table._id}
                tableNo={table.tableNo}
                name={table.name || `Table ${table.tableNo}`}
                status={table.status}
                initial={table.initial || `T${table.tableNo}`}
                seats={table.seats}
                currentOrder={table.currentOrder}
                onStatusChange={fetchTables}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add New Table Modal */}
      {isAddModalOpen && (
        <Modal title="Add New Dining Table" onCloseModal={() => setIsAddModalOpen(false)}>
          <form onSubmit={handleAddTable} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Table Number *
              </label>
              <input
                type="number"
                required
                min={1}
                value={newTableNo}
                onChange={(e) => setNewTableNo(e.target.value)}
                placeholder="e.g. 9"
                className="w-full bg-[#141414] border border-[#333] focus:border-yellow-500 text-white px-4 py-2.5 text-sm rounded-xl outline-none"
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
                value={newSeats}
                onChange={(e) => setNewSeats(e.target.value)}
                className="w-full bg-[#141414] border border-[#333] focus:border-yellow-500 text-white px-4 py-2.5 text-sm rounded-xl outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 text-sm rounded-xl transition-all shadow-md cursor-pointer"
            >
              {submitting ? "Adding Table..." : "Create Table"}
            </button>
          </form>
        </Modal>
      )}

      <BottomNav />
    </section>
  );
};

export default Tables;
