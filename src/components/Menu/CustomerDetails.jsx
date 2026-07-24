import { useSelector } from "react-redux";
import { createAvatar, formatDate, formatTime } from "../../Constants";
import { useEffect, useState } from "react";

function CustomerDetails() {
  const [dateTime, setDateTime] = useState(new Date());
  const customer = useSelector((state) => state.customer);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval); // clear the memory leak
  }, []);

  return (
    <div className="flex justify-between items-center pb-3 border-b border-[#2a2a2a] shrink-0">
      <div className="overflow-hidden">
        <h1 className="text-[#f5f5f5] text-base sm:text-lg font-bold truncate">
          {customer?.customerName || "Customer Name"}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#ababab] text-xs font-medium bg-[#262626] px-2 py-0.5 rounded">
            #{customer?.orderId || "N/A"}
          </span>
          <span className="text-[#ababab] text-xs font-medium">/ Dine In</span>
        </div>
        <p className="text-[#ababab] text-xs mt-1 font-mono">
          {formatDate(dateTime)} &bull; {formatTime(dateTime)}
        </p>
      </div>
      <div className="shrink-0 ml-2">
        <div className="bg-yellow-500 text-black text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-md">
          {createAvatar(customer?.customerName || "Customer Name")}
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;

