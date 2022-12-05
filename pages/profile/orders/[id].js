import React, { useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";
import styled, { css } from "styled-components";
import { Button, IconButton, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import Cookies from "cookies";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

import {
  addHoursToDate,
  getPersianDateWithMonthInLetters,
} from "utils/date-helper";
import MainLayout from "components/layouts/MainLayout";
import ProfileLayout from "components/layouts/ProfileLayout";
import DotDevider from "components/shared/DotDevider";
import Icon from "components/shared/Icon";
import { useCountdown } from "components/hooks/useCountDown";
import OrderDetails from "components/profile/orders/OrderDetails";
import { orderContext } from "context/order-context";
import { numberWithCommas } from "utils/number-helper";
import MyAccordion from "components/MyAccordion";
import { decodeToken } from "utils/token-helper";
import { calculateDiscountedTotalPrice } from "utils/product-helper";
import inProgressImg from "public/images/in-progress.svg";
import deliveredImg from "public/images/delivered.svg";
import cancelledImg from "public/images/cancelled.svg";
import failedImg from "public/images/failed.svg";

const StyledWaitForPaySection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey[800]};
  p {
    font-size: 0.75rem;
    color: #f9a825;
  }
`;

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
  const router = useRouter();
  const [isTransactionsDetailsOpen, setIsTransactionsDetailsOpen] =
    useState(false);
  const [discountedTotalPrice, setDiscountedTotalPrice] = useState();
  const [totalPrice, setTotalPrice] = useState();

  const { payBill } = useContext(orderContext);

  const { id } = router.query;

  const [days, hours, minutes, seconds] = useCountdown(
    addHoursToDate(order.createAt, 1)
  );

  useEffect(() => {
    let discountedTotalPrice = calculateDiscountedTotalPrice(order.items);
    let totalP = order.items.reduce((total, obj) => total + obj.price, 0);
    setTotalPrice(totalP);
    setDiscountedTotalPrice(discountedTotalPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Head>
        <title>{`پروفایل | سفارش ها | ${id}`}</title>
      </Head>
      <div className="flex items-center border-b-[1px] border-solid border-b-secondary-dark-200 py-4 dark:border-b-secondary-dark-800">
        <IconButton onClick={router.back} className="!text-[19px]">
          <Icon icon="arrow-right" size={19} />
        </IconButton>
        <Typography variant="body1">جزئیات سفارش</Typography>
      </div>
      {order.status === "wait-for-pay" && (
        <StyledWaitForPaySection>
          <Typography
            variant="body1"
            className="flex w-full justify-between lg:block lg:w-auto"
          >
            <Image src={inProgressImg} alt="wait-for-pay" className="ms-2" />
            {`در صورت عدم پرداخت تا ${minutes} دقیقه دیگر، سفارش لغو می شود.`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => payBill(order._id)}
            className="me-auto"
          >
            پرداخت
          </Button>
        </StyledWaitForPaySection>
      )}
      <div className="flex flex-col gap-y-3 p-3">
        <div className="order-status flex items-center py-2">
          <Image
            src={orderStates[order.status]}
            alt="order-status"
            className="ml-2"
          />
          {optionsCase[order.status]}
          <Icon className="me-auto" icon="chevron-left" size={24} />
        </div>
        <div className="flex flex-col items-center gap-y-3 lg:flex-row">
          <Typography
            variant="body1"
            className="flex w-full justify-between font-mono lg:block lg:w-auto"
          >
            <span className="ml-[4px] font-Byekan text-gray-400">
              شماره سفارش
            </span>
            {order?.orderNumber}
          </Typography>
          <DotDevider className="!hidden lg:!inline-block" />
          <Typography
            variant="body1"
            className="flex w-full justify-between lg:block lg:w-auto"
          >
            <span className="ml-[4px] text-gray-400">تاریخ ثبت سفارش</span>
            {getPersianDateWithMonthInLetters(order?.createAt)}
          </Typography>
        </div>
        <div className=" flex flex-col items-center gap-y-3 lg:flex-row">
          <Typography
            variant="body1"
            className="flex w-full justify-between lg:block lg:w-auto"
          >
            <span className="ml-[4px] text-gray-400">تحویل گیرنده</span>
            {` ${order?.address.receiver.fName} ${order?.address.receiver.lName}`}
          </Typography>
          <DotDevider className="!hidden lg:!inline-block" />
          <Typography
            variant="body1"
            className="flex w-full justify-between lg:block lg:w-auto"
          >
            <span className="ml-[4px] text-gray-400">شماره موبایل</span>
            {order?.address.receiver.phoneNumber}
          </Typography>
        </div>
        <Typography
          variant="body1"
          className="flex w-full justify-between lg:block lg:w-auto"
        >
          <span className="ml-[4px] basis-[160px] text-gray-400">آدرس</span>
          {` ${order?.address.city} - ${order?.address.postalAddress}`}
        </Typography>
      </div>
      <div className="flex items-center justify-center border-t-[1px] border-solid border-t-secondary-dark-200 p-[1rem] dark:border-t-secondary-dark-800">
        <MyAccordion
          onClick={() =>
            setIsTransactionsDetailsOpen(!isTransactionsDetailsOpen)
          }
          title={
            <div className="flex flex-1 flex-col gap-y-3 lg:flex-row lg:items-center">
              <Typography variant="body1" className="order-total-price flex">
                <span className="ml-auto text-gray-400 lg:ml-[8px]">مبلغ</span>
                {`${numberWithCommas(totalPrice)} تومان`}
              </Typography>
              {totalPrice - discountedTotalPrice != 0 && (
                <>
                  <DotDevider className="!hidden lg:!inline-block" />
                  <Typography
                    gutterBottom
                    className="!mb-0 flex items-baseline justify-between"
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
              <div className="flex self-center text-[13px] lg:mr-auto lg:self-end">
                <button
                  onClick={() =>
                    setIsTransactionsDetailsOpen(!isTransactionsDetailsOpen)
                  }
                  className="text-[0.8rem] text-accent-600 hover:text-accent-800 dark:text-accent-800"
                >
                  تاریخچه تراکنش ها
                </button>
                <FontAwesomeIcon
                  className="mr-1 text-accent-600 hover:text-accent-800 dark:text-accent-800"
                  icon={isTransactionsDetailsOpen ? faChevronUp : faChevronDown}
                  width={12}
                />
              </div>
            </div>
          }
          iconClassName="!hidden"
        >
          {order?.transactionDetails?.map((transaction) => (
            <div
              key={transaction._id}
              className="flex flex-col items-start rounded-[4px] border-[1px] border-solid border-secondary-dark-200 p-[0.7rem] dark:border-secondary-dark-800 lg:flex-row"
            >
              <Image
                src={transaction.status === "failed" ? failedImg : deliveredImg}
                alt="transaction-status"
                className="ml-2"
              />

              <div className="flex w-full flex-col lg:w-auto">
                <Typography
                  variant="body1"
                  className="flex w-full justify-between lg:block lg:w-auto"
                >
                  <span className="ml-[4px] inline text-gray-400 lg:hidden">
                    توضیحات
                  </span>
                  {transaction.status === "failed"
                    ? "پرداخت ناموفق"
                    : "پرداخت موفق"}
                </Typography>
                <Typography
                  variant="body1"
                  className="flex w-full justify-between lg:block lg:w-auto"
                >
                  <span className="ml-[4px] text-gray-400">شماره پیگیری</span>
                  {transaction.trackingNumber}
                </Typography>
              </div>
              <div className="mr-0 flex w-full flex-col items-center lg:mr-auto lg:w-auto lg:flex-row">
                <Typography
                  variant="body1"
                  className="flex w-full justify-between lg:block lg:w-auto"
                >
                  <span className="ml-[4px] inline text-gray-400 lg:hidden">
                    زمان
                  </span>
                  {getPersianDateWithMonthInLetters(transaction.paidAt)}
                </Typography>
                <DotDevider className="!hidden lg:!inline-block" />
                <Typography
                  variant="body1"
                  className="flex w-full justify-between lg:block lg:w-auto"
                >
                  <span className="ml-[4px] inline text-gray-400 lg:hidden">
                    مبلغ
                  </span>
                  {`${numberWithCommas(transaction.price)} تومان`}
                </Typography>
              </div>
            </div>
          ))}
        </MyAccordion>
      </div>
      {order.postTrackingNumber && (
        <div className="flex flex-col justify-center border-t-[1px] border-solid border-t-secondary-dark-200 p-[1rem] dark:border-t-secondary-dark-800">
          <p className="">
            با استفاده از سامانه رهگیری پست می‌توانید از وضعیت مرسوله با خبر
            شوید.
          </p>
          <Link
            href={`https://tracking.post.ir/search.aspx?id=${order.postTrackingNumber}`}
            passHref
          >
            <a
              target="_blank"
              className="flex items-center py-2 text-[13px] text-accent-600 hover:text-accent-800 dark:text-accent-800"
            >
              ورود به سامانه رهگیری
              <FontAwesomeIcon icon={faChevronLeft} width={12} />
            </a>
          </Link>
          <div className="flex items-center py-2 lg:gap-x-6">
            <span className="text-gray-400">کد رهگیری:</span>
            <span>
              {order.postTrackingNumber}
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(order.postTrackingNumber);
                }}
                className="cursor-pointer !text-[19px]"
              >
                <Icon icon="copy" size={19} />
              </IconButton>
            </span>
          </div>
        </div>
      )}

      {order?.items.map((item) => (
        <OrderDetails item={item} key={item._id} />
      ))}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const cookies = new Cookies(ctx.req, ctx.res);
  const authorization = cookies.get("authorization");
  if (!authorization) {
    return {
      redirect: {
        destination: `/users/login?returnUrl=${ctx.resolvedUrl}&forceLogout=true`,
        permanent: false,
      },
    };
  }

  const { data, status } = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/api/order/get/${ctx.params.id}`,
    {
      headers: {
        authorization: authorization,
      },
    }
  );

  const { user } = decodeToken(authorization);

  if (user.isAdmin) {
    return {
      redirect: {
        destination: `/dashboard`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      order: data?.order,
    },
  };
}

Order.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <ProfileLayout>{page}</ProfileLayout>
    </MainLayout>
  );
};

export default Order;
