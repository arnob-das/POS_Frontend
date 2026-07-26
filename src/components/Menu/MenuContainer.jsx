import { useState, useEffect } from "react";
import { FaCartFlatbed } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cartSlice";
import API from "../../utils/api";

const defaultCategories = [
  { id: "all", name: "All Dishes", bgColor: "#141414" },
  { id: "Fast Food", name: "Fast Food", bgColor: "#b73e3e" },
  { id: "Main Course", name: "Main Course", bgColor: "#40514e" },
  { id: "Pizza", name: "Pizza", bgColor: "#d92027" },
  { id: "Beverages", name: "Beverages", bgColor: "#2c3531" },
  { id: "Sides", name: "Sides", bgColor: "#e4b600" },
  { id: "Desserts", name: "Desserts", bgColor: "#4a235a" },
];

const MenuContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuItems, setMenuItems] = useState([]);
  const [quantityMap, setQuantityMap] = useState({});
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await API.get("/menu");
        setMenuItems(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load menu items from API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleQuantityChange = (id, type) => {
    setQuantityMap((prev) => {
      const currentQty = prev[id] || 0;
      let newQty = currentQty;

      if (type === "plus") {
        newQty = currentQty + 1;
      } else if (type === "minus") {
        newQty = Math.max(0, currentQty - 1);
      }

      return { ...prev, [id]: newQty };
    });
  };

  const handleAddToCart = (menuItem) => {
    const qty = quantityMap[menuItem._id || menuItem.id] > 0 ? quantityMap[menuItem._id || menuItem.id] : 1;

    const newCartItem = {
      id: menuItem._id || menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: qty,
      category: menuItem.category || "General",
    };

    dispatch(addToCart(newCartItem));
    setQuantityMap((prev) => ({ ...prev, [menuItem._id || menuItem.id]: 0 }));
  };

  const filteredItems = menuItems.filter(
    (item) => selectedCategory === "all" || item.category?.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Category Selection */}
      <div className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex gap-3 overflow-x-auto scrollbar-none shrink-0">
        {defaultCategories.map((cat) => (
          <div
            className={`px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 shadow-md whitespace-nowrap ${
              selectedCategory === cat.id
                ? "ring-2 ring-yellow-500 scale-[1.02] bg-yellow-500 text-black font-bold"
                : "bg-[#262626] text-gray-300 hover:text-white border border-[#333]"
            }`}
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <h1 className="text-xs sm:text-sm font-bold flex items-center gap-2">
              <span>{cat.name}</span>
            </h1>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-6 lg:px-8 my-1 shrink-0">
        <hr className="border-[#2a2a2a] border-t" />
      </div>

      {/* Dish Items Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 lg:px-8 py-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs">Loading Menu Items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            No menu items found for selected category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-4">
            {filteredItems.map((item) => {
              const itemId = item._id || item.id;
              const currentQty = quantityMap[itemId] || 0;
              return (
                <div
                  className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all flex flex-col justify-between min-h-[130px]"
                  key={itemId}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h1 className="text-[#f5f5f5] text-sm sm:text-base font-semibold tracking-wide line-clamp-2">
                        {item.name}
                      </h1>
                      <span className="text-[10px] text-gray-400 bg-[#262626] px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-yellow-500 hover:bg-yellow-400 p-2.5 rounded-xl text-black font-bold transition-transform active:scale-95 cursor-pointer shrink-0 shadow-md flex items-center gap-1 text-xs"
                      title="Add to Cart"
                    >
                      <FaCartFlatbed className="text-sm" /> Add
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#262626]">
                    <h1 className="text-yellow-500 text-base sm:text-lg font-bold">
                      {item.price} TK
                    </h1>
                    <div className="flex justify-between items-center gap-3 rounded-lg px-2.5 py-1 bg-[#1f1f1f] border border-[#2a2a2a]">
                      <button
                        className="text-yellow-500 text-lg font-bold cursor-pointer hover:scale-110 active:scale-95 transition-transform px-1"
                        onClick={() => handleQuantityChange(itemId, "minus")}
                      >
                        &minus;
                      </button>
                      <p className="text-[#f5f5f5] text-sm font-semibold min-w-[1.2rem] text-center">
                        {currentQty}
                      </p>
                      <button
                        className="text-yellow-500 text-lg font-bold cursor-pointer hover:scale-110 active:scale-95 transition-transform px-1"
                        onClick={() => handleQuantityChange(itemId, "plus")}
                      >
                        &#43;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuContainer;
