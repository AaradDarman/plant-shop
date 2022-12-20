import React, { useContext, useEffect } from "react";

import { useRouter } from "next/router";
import Cookies from "cookies";
import dynamic from "next/dynamic";
const PulseLoader = dynamic(() => import("react-spinners/PulseLoader"));
import { useTheme } from "@mui/system";
import Image from "next/image";

import MainLayout from "components/layouts/MainLayout";
import { orderContext } from "context/order-context";
import ProfileLayout from "components/layouts/ProfileLayout";
import OrdersSortOption from "components/profile/orders/OrdersSortOption";
const Order = dynamic(() => import("components/profile/orders/Order"));
import { decodeToken } from "utils/token-helper";
import { Typography } from "@mui/material";
import Head from "next/head";
import OrderContext from "context/OrderContext";
import http from "adapters/xhr/index";
import emptyListImg from "public/images/empty.svg";

const Orders = ({
  orders,
  inProgressOrdersCount,
  deliveredOrdersCount,
  cancelledOrdersCount,
}) => {
  const router = useRouter();
  const { handleShowPaymentStatusDialog } = useContext(orderContext);
  const theme = useTheme();
  const { isLoading } = useContext(orderContext);

  useEffect(() => {
    if (router.query.status) {
      handleShowPaymentStatusDialog(
        router.query.status,
        router.query.orderNumber,
        router.query.trackId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const handleTabChange = (newValue) => {
    router.replace({
      pathname: "/profile/orders",
      query: { activeTab: newValue },
    });
  };

  return (
    <div>
      <Head>
        <title>پروفایل | سفارش ها</title>
      </Head>
      <OrdersSortOption
        onSortChange={handleTabChange}
        value={router.query.activeTab}
        ordersCount={{
          inProgressOrdersCount,
          deliveredOrdersCount,
          cancelledOrdersCount,
        }}
      />
      {isLoading ? (
        <PulseLoader
          size={6}
          color={theme.palette.accent.main}
          loading={true}
          className="absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]"
        />
      ) : orders.length ? (
        orders.map((order) => <Order key={order._id} order={order} />)
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Image
            src={emptyListImg}
            alt="empty-list"
            className="drop-shadow-2xl"
          />
          <Typography variant="h6">لیست خالی می باشد</Typography>
        </div>
      )}
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

  const { user } = decodeToken(authorization);

  if (user.isAdmin) {
    return {
      redirect: {
        destination: `/dashboard`,
        permanent: false,
      },
    };
  }

  const { data, status } = await http.get(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/order?activeTab=${
      ctx.query.activeTab || "in-progress"
    }`,
    {
      headers: {
        authorization: authorization,
      },
    }
  );
  return {
    props: {
      orders: data.orders,
      inProgressOrdersCount: data.inProgressOrdersCount,
      deliveredOrdersCount: data.deliveredOrdersCount,
      cancelledOrdersCount: data.cancelledOrdersCount,
    },
  };
}

Orders.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <ProfileLayout>
        <OrderContext>{page}</OrderContext>
      </ProfileLayout>
    </MainLayout>
  );
};

export default Orders;
