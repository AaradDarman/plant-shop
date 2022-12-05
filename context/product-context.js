import { createContext } from "react";

export const productContext = createContext({
  addItemToCart: () => {},
  removeItemFromCart: () => {},
});
