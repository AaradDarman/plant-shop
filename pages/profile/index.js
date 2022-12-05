import React, { useContext, useEffect } from "react";

import dynamic from "next/dynamic";
import Cookies from "cookies";
const PulseLoader = dynamic(() => import("react-spinners/PulseLoader"));
import { Badge, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { useSelector } from "react-redux";
import Head from "next/head";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import MainLayout from "components/layouts/MainLayout";
const ProfileLayout = dynamic(() => import("components/layouts/ProfileLayout"));
import { decodeToken } from "utils/token-helper";
import useBreakpoints from "utils/useBreakPoints";
import { orderContext } from "context/order-context";
import OrderContext from "context/OrderContext";
import deliveredImg from "public/images/order-delivered.svg";
import inProgressImg from "public/images/order-in-progress.svg";
import cancelledImg from "public/images/order-cancelled.svg";

const Profile = () => {
  const { user } = useSelector((state) => state);
  const theme = useTheme();
  const { isLg } = useBreakpoints();
  const { getOrdersCount, ordersCount, isLoading } = useContext(orderContext);

  useEffect(() => {
    getOrdersCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>پروفایل</title>
      </Head>
      <div className="flex h-[288px] flex-col justify-evenly px-[2rem] py-[1rem]">
        {isLoading ? (
          <PulseLoader
            size={6}
            color={theme.palette.accent.main}
            loading={true}
            className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]"
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Typography
                variant="h6"
                className="border-b-[2px] border-b-accent-600 dark:border-b-accent-500"
              >
                سفارش های من
              </Typography>
              <Link href="/profile/orders" passHref>
                <a className="flex items-center hover:text-inherit">
                  مشاهده همه
                  <FontAwesomeIcon icon={faChevronLeft} width={19} />
                </a>
              </Link>
            </div>
            <div className="order-statuses flex items-center justify-evenly">
              <Link href="/profile/orders?activeTab=in-progress" passHref>
                <a className="flex flex-1 flex-col items-center hover:text-inherit lg:flex-row">
                  <Badge
                    overlap="circular"
                    invisible={isLg}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    color="primary"
                  >
                    <Image src={inProgressImg} alt="order-in-progress" />
                  </Badge>
                  <div className="px-2">
                    <Typography
                      variant="body1"
                      className="d-none d-lg-inline"
                    >{`${ordersCount?.inProgressOrdersCount} سفارش`}</Typography>
                    <Typography variant="subtitle2">جاری</Typography>
                  </div>
                </a>
              </Link>
              <Link href="/profile/orders?activeTab=delivered" passHref>
                <a className="flex flex-1 flex-col items-center hover:text-inherit lg:flex-row">
                  <Badge
                    overlap="circular"
                    invisible={isLg}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    color="primary"
                  >
                    <Image src={deliveredImg} alt="order-delivered" />
                  </Badge>
                  <div className="px-2">
                    <Typography
                      variant="body1"
                      className="d-none d-lg-inline"
                    >{`${ordersCount?.deliveredOrdersCount} سفارش`}</Typography>
                    <Typography variant="subtitle2">تحویل شده</Typography>
                  </div>
                </a>
              </Link>
              <Link href="/profile/orders?activeTab=cancelled" passHref>
                <a className="flex flex-1 flex-col items-center hover:text-inherit lg:flex-row">
                  <Badge
                    overlap="circular"
                    invisible={isLg}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    color="primary"
                  >
                    <Image src={cancelledImg} alt="order-cancelled" />
                  </Badge>
                  <div className="px-2">
                    <Typography
                      variant="body1"
                      className="d-none d-lg-inline"
                    >{`${ordersCount?.cancelledOrdersCount} سفارش`}</Typography>
                    <Typography variant="subtitle2">لغو شده</Typography>
                  </div>
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

Profile.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <ProfileLayout>
        <OrderContext>{page}</OrderContext>
      </ProfileLayout>
    </MainLayout>
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
    props: {},
  };
}

export default Profile;
