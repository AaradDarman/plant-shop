import React, { useContext, useEffect } from "react";

import { useSelector } from "react-redux";

import MainLayout from "components/layouts/MainLayout";
import CheckoutLayout from "components/layouts/CheckoutLayout";
import CartItems from "components/checkout/CartItems";
import ProductContext from "context/ProductContext";
import { orderContext } from "context/order-context";

const Cart = () => {
  const { cart, user } = useSelector((state) => state);
  const { setSelectedAddress } = useContext(orderContext);

  useEffect(() => {
    if (user?.user?.addresses) setSelectedAddress(user?.user?.addresses[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <CartItems items={cart?.items} className="flex-1" />
    </>
  );
};

Cart.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <CheckoutLayout>
        <ProductContext>{page}</ProductContext>
      </CheckoutLayout>
    </MainLayout>
  );
};

export default Cart;
