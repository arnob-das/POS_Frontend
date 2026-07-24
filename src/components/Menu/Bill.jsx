import { useSelector } from "react-redux";

function Bill() {
  const cartData = useSelector((state) => state.cart);

  const totalItems = cartData.reduce((acc, item) => acc + Number(item.quantity), 0);
  const subtotal = cartData.reduce((acc, item) => acc + Number(item.price), 0);

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <div className="shrink-0 pt-2 border-t border-[#2a2a2a] space-y-1.5">
      <div className="flex justify-between items-center text-xs sm:text-sm px-1">
        <p className="text-[#ababab]">Items ({totalItems})</p>
        <p className="text-[#f5f5f5] font-semibold">{subtotal} TK</p>
      </div>
      <div className="flex justify-between items-center text-xs sm:text-sm px-1">
        <p className="text-[#ababab]">Tax (5%)</p>
        <p className="text-[#f5f5f5] font-semibold">{tax} TK</p>
      </div>
      <div className="flex justify-between items-center text-sm sm:text-base px-1 pt-0.5 font-bold">
        <p className="text-[#f5f5f5]">Total</p>
        <p className="text-yellow-500 text-base sm:text-lg">{total} TK</p>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <button className="bg-[#262626] hover:bg-[#333] text-[#ababab] hover:text-white font-semibold py-1.5 px-2 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer">
          Cash
        </button>
        <button className="bg-[#262626] hover:bg-[#333] text-[#ababab] hover:text-white font-semibold py-1.5 px-2 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer">
          Online
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-2 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-md">
          Print Receipt
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1.5 px-2 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-md">
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Bill;