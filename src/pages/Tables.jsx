import { useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/Tables/TableCard";
import { tables } from "../Constants";

const Tables = () => {
  const [status, setStatus] = useState("all");
  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex justify-between items-center px-10 py-4 mt-2">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-wider text-2xl font-bold">
            Tables
          </h1>
        </div>
        <div className="flex justify-around items-center gap-4">
          <button
            onClick={() => {
              setStatus("all");
            }}
            className={`text-[#ababab] text-lg rounded-lg px-4 py-2 font-semibold ${"all" === status ? "bg-[#383838]" : ""}`}
          >
            All
          </button>
          <button
            onClick={() => {
              setStatus("booked");
            }}
            className={`text-[#ababab] text-lg rounded-lg px-4 py-2 font-semibold ${"booked" === status ? "bg-[#383838]" : ""}`}
          >
            Booked
          </button>
        </div>
      </div>
      <div className="px-10 py-10  justify-between  flex flex-wrap overflow-y-scroll scrollbar-none gap-4 h-[calc(100vh-12rem)]">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            id={table.id}
            name={table.name}
            status={table.status}
            initial={table.initial}
            seats={table.seats}
          />
        ))}
      </div>
      <BottomNav />
    </section>
  );
};

export default Tables;
