import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/Menu/MenuContainer";
import CustomerDetails from "../components/Menu/CustomerDetails";
import CartInfo from "../components/Menu/CartInfo";
import Bill from "../components/Menu/Bill";
import { useSelector } from "react-redux";

const Menu = () => {
  const customer = useSelector((state) => state.customer);
  return (
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row gap-3 p-2 sm:p-3 lg:p-4 pb-24 lg:pb-4">
      {/* Left section: Header & Menu items */}
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-[#1a1a1a] lg:bg-transparent rounded-xl p-2 lg:p-0">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-2 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wide">
              Menu
            </h1>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer bg-[#262626] sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-lg">
            <MdRestaurantMenu className="text-[#f5f5f5] text-2xl sm:text-3xl" />
            <div className="flex flex-col items-start">
              <h1 className="text-xs sm:text-sm text-[#f5f5f5] font-semibold leading-tight">
                {customer?.customerName || "Customer Name"}
              </h1>
              <p className="text-xs text-[#ababab] font-medium">
                Table No: {customer?.tableNo || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <MenuContainer />
      </div>

      {/* Right section: Cart Container */}
      <div className="w-full lg:w-[360px] xl:w-[400px] h-[550px] lg:h-full flex flex-col bg-[#1a1a1a] rounded-xl p-3.5 border border-[#2a2a2a] shrink-0 overflow-hidden shadow-xl">
        {/* Customer Details (Fixed Top) */}
        <CustomerDetails />

        {/* Cart Info (Scrollable Middle) */}
        <CartInfo />

        {/* Bill (Fixed Bottom) */}
        <Bill />
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;


