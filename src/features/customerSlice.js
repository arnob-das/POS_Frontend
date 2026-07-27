import { createSlice } from "@reduxjs/toolkit";

const getSavedCustomer = () => {
  try {
    const saved = localStorage.getItem("customer");
    return saved
      ? JSON.parse(saved)
      : { customerName: "", customerPhone: "", guests: 0, tableNo: "", orderId: "" };
  } catch (error) {
    return { customerName: "", customerPhone: "", guests: 0, tableNo: "", orderId: "" };
  }
};

const saveCustomerToStorage = (customer) => {
  try {
    localStorage.setItem("customer", JSON.stringify(customer));
  } catch (error) {
    console.error("Failed to save customer to localStorage", error);
  }
};

const initialState = getSavedCustomer();

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      const { name, phone, guests } = action.payload;
      state.customerName = name;
      state.customerPhone = phone;
      state.guests = guests;
      state.orderId = `${Date.now()}`;
      saveCustomerToStorage(state);
    },

    removeCustomer: (state) => {
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.tableNo = "";
      state.orderId = "";
      saveCustomerToStorage({ customerName: "", customerPhone: "", guests: 0, tableNo: "", orderId: "" });
    },

    updateTable: (state, action) => {
      state.tableNo = action.payload.tableNo;
      saveCustomerToStorage(state);
    },
  },
});

export const { setCustomer, removeCustomer, updateTable } = customerSlice.actions;
export default customerSlice.reducer;