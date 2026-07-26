import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "../features/customerSlice";
import cartSlice from "../features/cartSlice";
import authSlice from "../features/authSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    customer: customerSlice,
    cart: cartSlice,
  },
});

export default store;
