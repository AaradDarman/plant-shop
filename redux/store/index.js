import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import products from "redux/slices/products";
import cart from "redux/slices/cart";
import user from "redux/slices/user";
import { loadState } from "utils/browser-storage";
import { getInitialInfo } from "redux/slices/products";

const reducer = combineReducers({
  products,
  cart,
  user,
});

const store = configureStore({
  reducer,
  devTools: true,
  preloadedState: { cart: loadState() },
});

store.dispatch(getInitialInfo());

export default store;
