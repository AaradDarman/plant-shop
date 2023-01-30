import React, { useContext, useEffect, useState, useMemo } from "react";

import { Button } from "@mui/material";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Typography } from "@mui/material";
import Image from "next/image";
import clsx from "clsx";
import Head from "next/head";
import { toast } from "react-toastify";

import CheckoutStepper from "components/checkout/CheckoutStepper";
import { orderContext } from "context/order-context";
import {
  calculateDiscountedTotalPrice,
  calculateTotalDiscount,
} from "utils/product-helper";
import { numberWithCommas } from "utils/number-helper";
import emptyImg from "public/images/empty-cart.svg";

const StyledEmptyWraper = styled.div`
  height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const routesTitles = {
  "/checkout/cart": "فروشگاه | سبد خرید",
  "/checkout/shipping": "فروشگاه | ارسال کالا",
  "/checkout/payment": "فروشگاه | پرداخت",
};

const CheckoutLayout = ({ children }) => {
  const router = useRouter();
  const { cart } = useSelector((state) => state);
  const { takeOrder, selectedAddress } = useContext(orderContext);
  const [discountedTotalPrice, setDiscountedTotalPrice] = useState();
  const [totalDiscount, setTotalDiscount] = useState();

  useEffect(() => {
    let discountedTotalPrice = calculateDiscountedTotalPrice(cart.items);
    setDiscountedTotalPrice(discountedTotalPrice);
    setTotalDiscount(
      calculateTotalDiscount(cart.totalPrice, discountedTotalPrice)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.items]);

  const handleProceed = () => {
    if (router.pathname === "/checkout/cart") {
      router.push("/checkout/shipping");
    } else if (router.pathname === "/checkout/shipping") {
      if (isEmpty(selectedAddress)) {
        toast.error("برای ادامه یک آدرس انتخاب کنید", {
          position: "bottom-center",
          closeOnClick: true,
        });
      } else {
        router.push("/checkout/payment");
      }
    } else if (router.pathname === "/checkout/payment") {
      takeOrder();
    }
  };

  return (
    <>
      <Head>
        <title>{routesTitles[router.pathname]}</title>
      </Head>
      {isEmpty(cart.items) ? (
        <StyledEmptyWraper className="mb-2">
          <Image src={emptyImg} alt="empty-cart" className="drop-shadow-2xl" />
          <Typography variant="h5">سبد خرید شما خالی می باشد!</Typography>
        </StyledEmptyWraper>
      ) : (
        <>
          <CheckoutStepper />
          <div className="checkout-layout mb-2 flex min-h-[70vh] flex-row flex-wrap items-start">
            {children}
            <aside
              className={clsx(
                "checkout-proceed relative top-0",
                "flex w-full flex-col",
                "mr-auto mt-2 rounded-[4px] border-[1px] border-secondary-dark-800 p-[20px] md:mt-0",
                "md:sticky md:top-[56px] md:w-[300px]"
              )}
            >
              <div className="total-price-original flex justify-between pt-3">
                <span className="text-[14px]">{`قیمت کالا ها (${cart?.itemsCount})`}</span>
                <span>{`${numberWithCommas(cart?.totalPrice)} تومان`}</span>
              </div>
              <div className="total-price flex justify-between pt-3">
                <span className="text-[14px]">جمع سبد خرید</span>
                <span>{`${numberWithCommas(discountedTotalPrice)} تومان`}</span>
              </div>
              <p className=" ml-2 py-3 text-[0.7rem]">
                هزینه ارسال براساس آدرس، زمان تحویل، وزن و حجم مرسوله شما محاسبه
                می‌شود
              </p>
              {totalDiscount != 0 && (
                <Typography
                  gutterBottom
                  className="flex items-baseline justify-between pt-3"
                  variant="body1"
                  component="div"
                  color="error"
                >
                  <span className="text-[14px]">سود شما از خرید</span>
                  <span>
                    <span>{`(${Math.round(totalDiscount)}%)`}</span>
                    {`${numberWithCommas(
                      cart.totalPrice - discountedTotalPrice
                    )} تومان`}
                  </span>
                </Typography>
              )}
              <div className="total-price flex justify-between pt-3"></div>
              <Button
                variant="contained"
                onClick={handleProceed}
                classes={{
                  root: "!bg-accent-700 hover:!bg-accent-800 !text-white !mt-auto !hidden md:!block !text-center",
                }}
                sx={{ letterSpacing: "2px" }}
              >
                {`${router.pathname !== "/checkout/cart" ? "پرداخت" : "ادامه"}`}
              </Button>
            </aside>
            <div
              className={clsx(
                "proceed-btn-mobile fixed bottom-0 right-0 left-0 ",
                "flex justify-between",
                "border-t-[1px] border-t-secondary-dark-800 bg-secondary-light py-3 px-4",
                "md:hidden",
                "dark:bg-secondary-dark-900"
              )}
            >
              <Button
                variant="contained"
                onClick={handleProceed}
                className="w-1/2 !bg-accent-700 !text-white hover:!bg-accent-800"
                sx={{ letterSpacing: "2px" }}
              >
                {`${router.pathname !== "/checkout/cart" ? "پرداخت" : "ادامه"}`}
              </Button>
              <div className="total-price flex flex-col">
                <span>جمع سبد خرید</span>
                <span>{`${numberWithCommas(discountedTotalPrice)} تومان`}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CheckoutLayout;
