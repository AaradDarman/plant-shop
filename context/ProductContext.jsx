import React from "react";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

import {
  addItemToDbCart,
  addItemToLocalCart,
  removeItemFromDbCart,
  removeItemFromLocalCart,
} from "redux/slices/cart";

import { productContext } from "./product-context";

const ProductContext = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addItemToCart = (product) => {
    if (isEmpty(user)) {
      dispatch(addItemToLocalCart(product));
    } else {
      dispatch(addItemToDbCart({ item: product, userId: user._id }));
    }
  };

  const removeItemFromCart = (product) => {
    if (isEmpty(user)) {
      dispatch(removeItemFromLocalCart(product));
    } else {
      dispatch(removeItemFromDbCart({ item: product, userId: user._id }));
    }
  };

  return (
    <productContext.Provider value={{ addItemToCart, removeItemFromCart }}>
      {children}
    </productContext.Provider>
  );
};

export default ProductContext;
