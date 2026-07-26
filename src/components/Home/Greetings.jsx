import { useState, useEffect } from "react";
import { formatDate, formatTime } from "../../Constants";
import { useSelector } from "react-redux";

export default function Greetings() {
  const [dateTime, setDateTime] = useState(new Date());
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = dateTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex justify-between items-center px-8 mt-5">
      <div>
        <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wide">
          {getGreeting()}, <span className="text-yellow-500">{user?.name || "Staff"}</span>
        </h1>
        <p className="text-[#ababab] text-sm mt-0.5">
          Give your best services to your dining customers today.
        </p>
      </div>
      <div className="text-right">
        <h1 className="text-[#f5f5f5] text-2xl font-extrabold tracking-wide font-mono">
          {formatTime(dateTime)}
        </h1>
        <p className="text-[#ababab] text-xs font-mono mt-0.5">{formatDate(dateTime)}</p>
      </div>
    </div>
  );
}
