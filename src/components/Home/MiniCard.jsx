import React from "react";

export default function MiniCard({ title, icon, number, footerNum }) {
  return (
    <div className="bg-[#1a1a1a] py-5 px-5 rounded-lg w-1/2 ">
      <div className="flex items-center justify-between">
        <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
          {title}
        </h1>
        <button
          className={`${title === "Total Earnings" ? "bg-green-500" : "bg-yellow-500"} p-3 rounded-lg text-[#f5f5f5]`}
        >
          {icon}
        </button>
      </div>
      <div>
        <h1 className="text-[#f5f5f5] text-5xl font-bold mt-5">{number}</h1>
        <h1 className="text-[#f5f5f5] text-lg fmt-5">
          <span className="text-green-500 ">{footerNum}</span>% than yesterday
        </h1>
      </div>
    </div>
  );
}
