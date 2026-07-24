import React from "react";
import { FaCheckDouble, FaCircle } from "react-icons/fa";

function OrderCard() {
  return (
    <div className="w-[400px] bg-[#2a2a2a] p-4 rounded-lg">
      <div className="flex items-center gap-5">
        <button className="bg-yellow-500 p-3 font-bold text-[#f5f5f5] text-xl rounded-lg">
          AM
        </button>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
              Arnob Das
            </h1>
            <p className="text-[#ababab] text-sm">#101/ Dine in</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-green-600 px-2 py-1 rounded bg-green-300 ">
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
      <div className="flex items-center justify-between w-full text-sm text-[#ababab] mt-6">
        <div>
          <p>July 20, 2026 04:28 PM</p>
        </div>
        <div>
          <p>8 Items</p>
        </div>
      </div>
      <hr className="my-4 border-[#ababab]" />
      <div className="flex items-center justify-between w-full text-lg text-[#f5f5f5] font-bold">
        <div>
          <p>Total</p>
        </div>
        <div>
          <p>250 Tk</p>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
