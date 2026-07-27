import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../features/cartSlice";
import { removeCustomer } from "../../features/customerSlice";
import API from "../../utils/api";
import { FaUtensils, FaCheckCircle } from "react-icons/fa";

function Bill() {
  const cartData = useSelector((state) => state.cart);
  const customer = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const totalItems = cartData.reduce((acc, item) => acc + Number(item.quantity || 1), 0);
  const subtotal = cartData.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (cartData.length === 0) {
      alert("Your cart is empty! Please add items from the menu first.");
      return;
    }

    if (!customer?.customerName || !customer?.customerPhone) {
      alert("Customer details missing! Please enter customer name and phone first.");
      return;
    }

    if (!customer?.tableNo) {
      alert("No table selected! Please select a table first.");
      return;
    }

    const payload = {
      customerDetails: {
        name: customer.customerName,
        phone: customer.customerPhone,
        guests: customer.guests || 1,
      },
      tableNo: Number(customer.tableNo.toString().replace(/[^0-9]/g, "") || 1),
      bills: {
        total: subtotal,
        tax: tax,
        totalWithTax: total,
      },
      items: cartData.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        category: item.category || "General",
      })),
      paymentMethod: "Cash",
      paymentStatus: "Pending", // Cashier receives payment at final checkout
    };

    setLoading(true);
    setSuccessMsg("");

    try {
      const res = await API.post("/order", payload);
      setSuccessMsg(`Order placed successfully for Table #${customer.tableNo}! Sent to Kitchen.`);
      dispatch(clearCart());
      dispatch(removeCustomer());
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      console.error("Order Placement Error:", err);
      alert(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shrink-0 pt-2 border-t border-[#2a2a2a] space-y-2">
      {/* Items & Financial Breakdown */}
      <div className="flex justify-between items-center text-xs sm:text-sm px-1">
        <p className="text-[#ababab]">Subtotal ({totalItems} items)</p>
        <p className="text-[#f5f5f5] font-semibold">{subtotal} TK</p>
      </div>
      <div className="flex justify-between items-center text-xs sm:text-sm px-1">
        <p className="text-[#ababab]">Tax VAT (5%)</p>
        <p className="text-[#f5f5f5] font-semibold">{tax} TK</p>
      </div>
      <div className="flex justify-between items-center text-sm sm:text-base px-1 pt-1 border-t border-[#2a2a2a] font-bold">
        <p className="text-[#f5f5f5]">Grand Total</p>
        <p className="text-yellow-500 text-base sm:text-lg">{total} TK</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 p-2 rounded-xl text-xs font-bold flex items-center gap-2">
          <FaCheckCircle className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        disabled={loading || cartData.length === 0}
        onClick={handlePlaceOrder}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold py-3 px-3 text-sm rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <FaUtensils /> Confirm & Send to Kitchen ({total} TK)
          </>
        )}
      </button>
    </div>
  );
}

export default Bill;