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

// Centralized Redux Store Subscription for State Persistence
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem("cart", JSON.stringify(state.cart));
    localStorage.setItem("customer", JSON.stringify(state.customer));
  } catch (error) {
    console.error("Failed to persist state to localStorage", error);
  }
});

export default store;

