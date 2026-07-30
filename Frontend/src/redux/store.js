import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import adminSlice from "./adminSlice.js";
import cartReducer from "./cartSlice.js";
import userSlice from "./userSlice.js";
import productsReducer from "./productsSlice.js";

const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

const rootReducer = combineReducers({
  Admin: adminSlice,
  Cart: cartReducer,
  User: userSlice,
  Products: productsReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
