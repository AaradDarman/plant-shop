import React from "react";

import Item from "./Item";

const CartItems = ({ items, className }) => {
  return (
    <div
      className={`items ml-0 mb-2 rounded-[4px] border-[1px] border-secondary-dark-800 md:mb-0 md:ml-2 ${className}`}
    >
      {items.map((item) => (
        <Item key={`${item._id}${item.size}`} item={item} />
      ))}
    </div>
  );
};

export default CartItems;
