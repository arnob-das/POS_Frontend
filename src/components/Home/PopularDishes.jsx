import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { popularDishes as fallbackDishes } from "../../Constants";
import { MdRestaurantMenu } from "react-icons/md";

function PopularDishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularDishes = async () => {
      try {
        const response = await API.get("/order/popular-dishes");
        if (response.data?.data && response.data.data.length > 0) {
          setDishes(response.data.data);
        } else {
          setDishes(fallbackDishes);
        }
      } catch (err) {
        console.error("Failed to fetch popular dishes:", err);
        setDishes(fallbackDishes);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularDishes();
  }, []);

  return (
    <div className="mt-6 pr-4 sm:pr-6">
      <div className="bg-[#1a1a1a] w-full rounded-2xl border border-[#2a2a2a] p-4 sm:p-5 shadow-lg">
        <div className="flex justify-between items-center px-2 mb-4">
          <h1 className="text-white text-lg font-bold tracking-wide flex items-center gap-2">
            <MdRestaurantMenu className="text-yellow-500 text-xl" />
            Popular Dishes
          </h1>
          <span className="text-xs bg-yellow-500/10 text-yellow-400 font-semibold px-2.5 py-1 rounded-full border border-yellow-500/20">
            Live Rankings
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12 text-gray-400 text-sm animate-pulse">
            Loading popular dishes...
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[600px] space-y-3 pr-1 scrollbar-thin scrollbar-thumb-[#333]">
            {dishes.map((dish, index) => {
              // Find matching image from fallback if available
              const fallback = fallbackDishes.find(
                (f) => f.name.toLowerCase() === dish.name.toLowerCase()
              );
              const rank = index + 1;

              return (
                <div
                  className="flex items-center justify-between bg-[#242424] hover:bg-[#2c2c2c] transition-all rounded-xl p-3.5 border border-[#333]"
                  key={dish._id || dish.id || index}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm ${
                      rank === 1 ? "bg-yellow-500 text-black shadow-md shadow-yellow-500/20" :
                      rank === 2 ? "bg-gray-300 text-black" :
                      rank === 3 ? "bg-amber-700 text-white" :
                      "bg-[#1a1a1a] text-gray-400 border border-[#3a3a3a]"
                    }`}>
                      {rank < 10 ? `0${rank}` : rank}
                    </span>

                    {fallback?.image ? (
                      <img
                        src={fallback.image}
                        alt={dish.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#3a3a3a]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold text-lg border border-yellow-500/20">
                        {dish.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h2 className="text-white text-sm font-semibold tracking-wide">
                        {dish.name}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        <span className="text-yellow-500 font-bold">TK {dish.price}</span>
                        {dish.category && <span className="ml-2 text-gray-500">• {dish.category}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#3a3a3a]">
                      {dish.numberOfOrders || 0} Orders
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PopularDishes;
