import { FaNotesMedical } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { removeItemFromCart } from "../../features/cartSlice";
import { useEffect, useRef } from "react";

function CartInfo() {
  const cartData = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const scrollRef = useRef();

  const handleRemoveCartItem = (itemId) => {
    dispatch(removeItemFromCart(itemId));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartData]);

  return (
    <div className="flex-1 flex flex-col min-h-0 my-2 overflow-hidden">
      <div className="flex justify-between items-center mb-3 shrink-0">
        <h1 className="text-[#f5f5f5] text-base font-semibold">
          Order Details
        </h1>
        <span className="text-xs text-[#ababab] bg-[#262626] px-2 py-0.5 rounded-full font-medium">
          {cartData.length} {cartData.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2.5" ref={scrollRef}>
        {cartData.length === 0 ? (
          <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-center p-4 text-[#ababab] bg-[#1f1f1f]/50 rounded-lg border border-dashed border-[#2a2a2a]">
            <p className="text-sm font-medium">Your cart is empty.</p>
            <p className="text-xs text-[#777] mt-1">
              Start adding items from the menu!
            </p>
          </div>
        ) : (
          cartData?.map((item) => {
            return (
              <div
                key={item.id}
                className="bg-[#1f1f1f] p-3 rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all"
              >
                <div className="flex justify-between items-start gap-2">
                  <h1 className="text-[#ababab] text-sm font-semibold truncate">
                    {item.name}
                  </h1>
                  <span className="text-xs font-bold text-[#f5f5f5] bg-[#2a2a2a] px-2 py-0.5 rounded shrink-0">
                    x{item.quantity}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-[#2a2a2a]/60">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRemoveCartItem(item.id)}
                      className="p-1.5 hover:bg-[#2a2a2a] rounded transition-colors text-[#ababab] hover:text-red-400 cursor-pointer"
                      title="Remove Item"
                    >
                      <RiDeleteBin2Fill className="text-base" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-[#2a2a2a] rounded transition-colors text-[#ababab] hover:text-yellow-400 cursor-pointer"
                      title="Add Notes"
                    >
                      <FaNotesMedical className="text-sm" />
                    </button>
                  </div>
                  <p className="text-[#f5f5f5] font-bold text-sm">
                    {item.price} TK
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CartInfo;
