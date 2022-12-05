import React from "react";

import { Badge } from "@mui/material";
import Link from "next/link";
import { useSelector } from "react-redux";

import Icon from "components/shared/Icon";

const CartItemsIcon = () => {
  const { cart } = useSelector((state) => state);

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      badgeContent={cart?.itemsCount}
      color="error"
    >
      <Link href="/checkout/cart" passHref>
        <a className="p-1 hover:text-inherit">
          <Icon icon="cart" size={24} />
        </a>
      </Link>
    </Badge>
  );
};

export default CartItemsIcon;
