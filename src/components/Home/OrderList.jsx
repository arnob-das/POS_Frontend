import React from "react";
import { FaCheckDouble, FaCircle } from "react-icons/fa";

const OrderList = () => {
  return (
    <div className="flex items-center mb-6 gap-5">
      <button className="bg-yellow-500 p-3 font-bold text-[#f5f5f5] text-xl rounded-lg">
        AM
      </button>
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Arnob Das
          </h1>
          <p className="text-[#ababab] text-sm">8 Items</p>
        </div>
        <div>
          <h1 className="text-yellow-500 text-semibold border border-[#f6b100] rounded-lg p-2 ">
            Table No: 4
          </h1>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-green-600 px-4">
            <FaCheckDouble className="inline mr-2" />
            Ready
          </p>
          <p className="text-[#ababab] text-sm">
            <FaCircle className="inline mr-2 text-green-600" />
            Ready to serve
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
