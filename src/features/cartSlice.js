import { createSlice } from "@reduxjs/toolkit";

const getSavedCart = () => {
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage", error);
  }
};

const initialState = getSavedCart();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (itemIndex >= 0) {
        state[itemIndex].quantity += action.payload.quantity || 1;
      } else {
        state.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
      saveCartToStorage(state);
    },
    incrementQuantity: (state, action) => {
      const item = state.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      saveCartToStorage(state);
    },
    decrementQuantity: (state, action) => {
      const item = state.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          saveCartToStorage(state);
        } else {
          const newState = state.filter((i) => i.id !== action.payload);
          saveCartToStorage(newState);
          return newState;
        }
      }
    },
    removeItemFromCart: (state, action) => {
      const newState = state.filter((item) => item.id !== action.payload);
      saveCartToStorage(newState);
      return newState;
    },
    clearCart: () => {
      saveCartToStorage([]);
      return [];
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeItemFromCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

