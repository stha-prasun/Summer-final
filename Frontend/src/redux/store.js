import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./adminSlice.js";
import cartReducer from "./cartSlice.js";

const store = configureStore({
  reducer: {
    Admin: adminSlice,
    Cart: cartReducer,
  },
});

export default store;
