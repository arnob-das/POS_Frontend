import React, { useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/Orders/OrderCard";
import BackButton from "../components/shared/BackButton";

function Orders() {
  const [status, setStatus] = useState("all");

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex justify-between items-center px-10 py-4 mt-2">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-wider text-2xl font-bold">
            Orders
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
              setStatus("in-progress");
            }}
            className={`text-[#ababab] text-lg rounded-lg px-4 py-2 font-semibold ${"in-progress" === status ? "bg-[#383838]" : ""}`}
          >
            In Progress
          </button>
          <button
            onClick={() => {
              setStatus("ready");
            }}
            className={`text-[#ababab] text-lg rounded-lg px-4 py-2 font-semibold ${"ready" === status ? "bg-[#383838]" : ""}`}
          >
            Ready
          </button>
          <button
            onClick={() => {
              setStatus("completed");
            }}
            className={`text-[#ababab] text-lg rounded-lg px-4 py-2 font-semibold ${"completed" === status ? "bg-[#383838]" : ""}`}
          >
            Completed
          </button>
        </div>
      </div>
      <div className="px-10 py-4  justify-between  flex flex-wrap overflow-y-scroll scrollbar-none gap-4 h-[calc(100vh-12rem)]">
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
        <OrderCard />
      </div>
      <BottomNav />
    </section>
  );
}

export default Orders;
