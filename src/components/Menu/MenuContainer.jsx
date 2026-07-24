import { useState } from "react";
import { menus } from "../../Constants";
import { FaCartFlatbed } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cartSlice";

const MenuContainer = () => {
  const [selectedItem, setSelectedItem] = useState(menus[0].id);
  const [quantity, setQuantity] = useState(0);
  const [itemId, setItemId] = useState(0);

  const dispatch = useDispatch();

  const handleQuantity = (type, id) => {
    if (itemId !== id) {
      setItemId(id);
      setQuantity(type === "plus" ? 1 : 0);
      return;
    }

    if (type === "minus") {
      if (quantity > 0) {
        setQuantity(quantity - 1);
      }
    } else if (type === "plus") {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = (menuItem) => {
    if (quantity <= 0 || itemId !== menuItem.id) return;

    const { name, price } = menuItem;

    const newCartItem = {
      id: Date.now(),
      name,
      pricePerQuantity: price,
      quantity,
      price: price * quantity,
    };

    dispatch(addToCart(newCartItem));
    setQuantity(0);
    setItemId(0);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Category Selection */}
      <div className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 shrink-0">
        {menus.map((menu) => (
          <div
            className={`px-3 sm:px-5 py-3 rounded-xl cursor-pointer transition-all duration-200 shadow-md ${
              selectedItem === menu.id
                ? "ring-2 ring-white scale-[1.02]"
                : "opacity-85 hover:opacity-100"
            }`}
            style={{ backgroundColor: menu.bgColor }}
            key={menu.id}
            onClick={() => {
              setSelectedItem(menu.id);
              setItemId(0);
              setQuantity(0);
            }}
          >
            <h1 className="text-white font-bold text-sm sm:text-base py-0.5 flex items-center gap-2 truncate">
              <span>{menu.icon}</span> <span>{menu.name}</span>
            </h1>
            <p className="text-[#ababab] text-xs sm:text-sm py-0.5 font-medium">
              {menu.items.length} Items
            </p>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-6 lg:px-8 my-1 shrink-0">
        <hr className="border-[#2a2a2a] border-t" />
      </div>

      {/* Dish Items Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-4">
          {menus
            .find((menu) => menu?.id == selectedItem)
            ?.items.map((item) => (
              <div
                className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all flex flex-col justify-between min-h-[130px]"
                key={item.id}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h1 className="text-[#f5f5f5] text-sm sm:text-base font-semibold tracking-wide line-clamp-2">
                    {item.name}
                  </h1>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-600 hover:bg-green-500 p-2.5 rounded-lg text-white transition-colors cursor-pointer shrink-0 shadow"
                    title="Add to Cart"
                  >
                    <FaCartFlatbed className="text-base" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#262626]">
                  <h1 className="text-yellow-500 text-base sm:text-lg font-bold">
                    {item.price} Tk
                  </h1>
                  <div className="flex justify-between items-center gap-3 rounded-lg px-2.5 py-1 bg-[#1f1f1f] border border-[#2a2a2a]">
                    <button
                      className="text-yellow-500 text-lg font-bold cursor-pointer hover:scale-110 active:scale-95 transition-transform px-1"
                      onClick={() => handleQuantity("minus", item.id)}
                    >
                      &minus;
                    </button>
                    <p className="text-[#f5f5f5] text-sm font-semibold min-w-[1.2rem] text-center">
                      {item.id === itemId ? quantity : 0}
                    </p>
                    <button
                      className="text-yellow-500 text-lg font-bold cursor-pointer hover:scale-110 active:scale-95 transition-transform px-1"
                      onClick={() => handleQuantity("plus", item.id)}
                    >
                      &#43;
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenuContainer;

