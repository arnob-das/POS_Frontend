import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "../features/customerSlice";
import cartSlice from "../features/cartSlice"

const store = configureStore({
  reducer: {
    customer: customerSlice,
    cart: cartSlice,
  },
});

export default store;
