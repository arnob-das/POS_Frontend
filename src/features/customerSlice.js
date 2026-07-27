import { createSlice } from "@reduxjs/toolkit";

const defaultCustomer = {
  customerName: "",
  customerPhone: "",
  guests: 0,
  tableNo: "",
  orderId: "",
};

const getSavedCustomer = () => {
  try {
    const saved = localStorage.getItem("customer");
    return saved ? JSON.parse(saved) : defaultCustomer;
  } catch (error) {
    return defaultCustomer;
  }
};

const customerSlice = createSlice({
  name: "customer",
  initialState: getSavedCustomer(),
  reducers: {
    setCustomer: (state, action) => {
      const { name, phone, guests } = action.payload;
      state.customerName = name;
      state.customerPhone = phone;
      state.guests = guests;
      state.orderId = `${Date.now()}`;
    },

    removeCustomer: () => defaultCustomer,

    updateTable: (state, action) => {
      state.tableNo = action.payload.tableNo;
    },
  },
});

export const { setCustomer, removeCustomer, updateTable } = customerSlice.actions;
export default customerSlice.reducer;