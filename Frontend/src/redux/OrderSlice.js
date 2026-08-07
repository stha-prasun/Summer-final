import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    selectedOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    setOrders: (state, action) => {
      state.items = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setOrders, setSelectedOrder, setLoading, setError } = ordersSlice.actions;
export default ordersSlice.reducer;