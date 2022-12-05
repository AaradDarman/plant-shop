import { Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

import {
  addHoursToDate,
  getPersianDateWithMonthInLetters,
} from "utils/date-helper";
import { numberWithCommas } from "utils/number-helper";
import DotDevider from "components/shared/DotDevider";
import OrderItem from "./OrderItem";
import { useCountdown } from "components/hooks/useCountDown";
import { orderContext } from "context/order-context";
import {
  calculateDiscountedTotalPrice,
  calculateTotalDiscount,
} from "utils/product-helper";
import inProgressImg from "public/images/in-progress.svg";
import deliveredImg from "public/images/delivered.svg";
import cancelledImg from "public/images/cancelled.svg";

const optionsCase = {
  "wait-for-pay": "در انتظار پرداخت",
  "in-progress": "در حال پردازش",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

const orderStates = {
  "wait-for-pay": inProgressImg,
  "in-progress": inProgressImg,
  delivered: deliveredImg,
  cancelled: cancelledImg,
};

const Order = ({ order }) => {
  const [days, hours, minutes, seconds] = useCountdown(
    addHoursToDate(order.createAt, 1)
  );
  const { payBill } = useContext(orderContext);
  const [discountedTotalPrice, setDiscountedTotalPrice] = useState();
  const [totalDiscount, setTotalDiscount] = useState();
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    let discountedTotalPrice = calculateDiscountedTotalPrice(order.items);
    let totalP = order.items.reduce((total, obj) => total + obj.price, 0);
    setTotalPrice(totalP);
    setDiscountedTotalPrice(discountedTotalPrice);
    setTotalDiscount(calculateTotalDiscount(totalP, discountedTotalPrice));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col rounded-[4px] border-[1px] border-solid border-secondary-dark-200 p-[1rem] dark:border-secondary-dark-800">
      <Link passHref href={`/profile/orders/${order.orderNumber}`}>
        <a className="hover:text-inherit">
          <div className="order-status flex items-center py-2">
            <Image
              src={orderStates[order.status]}
              alt="order-status"
              className="ml-2"
            />
            {optionsCase[order.status]}
            <FontAwesomeIcon
              icon={faChevronLeft}
              width={24}
              className="mr-auto"
            />
          </div>
          <div className="hidden py-2 lg:flex">
            <Typography variant="body1" className="order-date">
              {getPersianDateWithMonthInLetters(order.createAt)}
            </Typography>
            <DotDevider />
            <Typography variant="body1" className="font-mono">
              <span className="ml-[8px] font-Byekan text-gray-400">
                شماره سفارش
              </span>
              {order.orderNumber}
            </Typography>
            <DotDevider />
            <Typography variant="body1" className="order-total-price">
              <span className="ml-[8px] text-gray-400">مبلغ</span>
              {`${numberWithCommas(totalPrice)} تومان`}
            </Typography>
            {totalDiscount != 0 && (
              <>
                <DotDevider />
                <Typography
                  className="flex items-baseline justify-between"
                  variant="body1"
                  component="div"
                >
                  <span className="ml-[8px] text-gray-400">
                    سود شما از خرید
                  </span>
                  <span>
                    {`${numberWithCommas(
                      totalPrice - discountedTotalPrice
                    )} تومان`}
                  </span>
                </Typography>
              </>
            )}
          </div>
          <div className="flex py-2 lg:hidden">
            <Typography variant="body1" className="font-mono">
              <span className="ml-[8px] font-Byekan text-gray-400">
                شماره سفارش
              </span>
              {order.orderNumber}
            </Typography>
          </div>
          <div className="flex flex-wrap items-center justify-between py-2 lg:hidden">
            <Typography variant="body1" className="order-date">
              {getPersianDateWithMonthInLetters(order.createAt)}
            </Typography>
            <Typography variant="body1" className="order-total-price">
              <span className="ml-[8px] text-gray-400">مبلغ</span>
              {`${numberWithCommas(totalPrice)} تومان`}
            </Typography>
          </div>
          <div className="bpord flex flex-wrap items-center border-t-[1px] border-solid border-t-secondary-dark-200 dark:border-t-secondary-dark-800">
            {order?.items.map((item) => (
              <OrderItem key={item._id} item={item} />
            ))}
          </div>
        </a>
      </Link>
      {order.status === "wait-for-pay" && (
        <div className="flex items-center justify-center p-[1rem]">
          <Typography
            variant="body1"
            className="flex items-center text-[0.75rem] text-[#f9a825]"
          >
            <Image
              src={inProgressImg}
              alt="wait-for-pay"
              className="ml-2"
              width={18}
              height={18}
            />

            {`در صورت عدم پرداخت تا ${minutes} دقیقه دیگر، سفارش لغو می شود.`}
          </Typography>
          <Button
            variant="contained"
            onClick={() => payBill(order._id)}
            classes={{
              root: "!mr-auto !bg-accent-700 hover:!bg-accent-800 !text-white !mt-auto !hidden md:!block !text-center",
            }}
          >
            پرداخت
          </Button>
        </div>
      )}
    </div>
  );
};

export default Order;
