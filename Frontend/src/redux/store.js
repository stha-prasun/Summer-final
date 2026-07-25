import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./adminSlice.js";

const store = configureStore({
  reducer: {
    Admin: adminSlice,
  },
});

export default store;
