import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loggedInAdmin: null,
  },
  reducers: {
    setLoggedInAdmin: (state, action) => {
      state.loggedInAdmin = action.payload;
    },
  },
});

export const { setLoggedInAdmin } = adminSlice.actions;
export default adminSlice.reducer;