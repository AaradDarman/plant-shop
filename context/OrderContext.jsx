import React, { useEffect, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { orderContext } from "./order-context";
import PaymentStatusDialog from "components/modals/PaymentStatusDialog";
import userApi from "adapters/user-adapter";
import LoadingComponent from "components/shared/LoadingComponent";

const OrderContext = ({ children }) => {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [status, setStatus] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIsLoading, setPaymentIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersCount, setOrdersCount] = useState({});

  const { user } = useSelector((state) => state);
  const [selectedAddress, setSelectedAddress] = useState({});
  const router = useRouter();

  const handleShowPaymentStatusDialog = (
    status,
    orderNumber,
    trackingNumber
  ) => {
    setStatus(status);
    setOrderNumber(orderNumber);
    setTrackingNumber(trackingNumber);
    setShowStatusDialog(true);
  };

  useEffect(() => {
    const handleChangeStart = (url) => {
      if (
        url === "/" ||
        url.startsWith("/product/") ||
        url.startsWith("/checkout") ||
        url.startsWith("/users/login") ||
        url.startsWith("/users/signup") ||
        url.startsWith("/dashboard") ||
        url.startsWith("/profile/orders/") ||
        url === "/profile"
      )
        return;
      if (url.startsWith("/profile/orders")) setIsLoading(true);
    };

    const handleChangeEnd = (url) => {
      if (url === "/profile"  ) return;
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleChangeStart);
    router.events.on("routeChangeComplete", handleChangeEnd);
    router.events.on("routeChangeError", handleChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleChangeStart);
      router.events.off("routeChangeComplete", handleChangeEnd);
      router.events.off("routeChangeError", handleChangeEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrdersCount = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await userApi.getUserOrdersCount(user.user._id);
      if (status === 200) {
        setIsLoading(false);
        setOrdersCount(data);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const takeOrder = async () => {
    setPaymentIsLoading(true);
    try {
      const { data, status } = await axios.post("/api/order", {
        client: user.user._id,
        address: selectedAddress,
      });
      if (status === 200) {
        router.push(data.paymentUrl);
        setPaymentIsLoading(false);
      }
    } catch (error) {
      setPaymentIsLoading(false);
      console.log(error);
    }
  };

  const payBill = async (orderId) => {
    setPaymentIsLoading(true);
    try {
      const { data, status } = await axios.post("/api/order/pay", {
        orderId,
      });
      if (status === 200) {
        router.push(data.paymentUrl);
        setPaymentIsLoading(false);
      }
    } catch (error) {
      setPaymentIsLoading(false);
      console.log(error);
    }
  };

  const handleClosePaymentStatusDialog = () => {
    setShowStatusDialog(false);
    router.replace("/profile/orders", undefined, { shallow: true });
  };

  return (
    <orderContext.Provider
      value={{
        selectedAddress,
        setSelectedAddress,
        takeOrder,
        payBill,
        handleShowPaymentStatusDialog,
        getOrdersCount,
        orders,
        ordersCount,
        isLoading,
      }}
    >
      {children}
      <PaymentStatusDialog
        isOpen={showStatusDialog}
        onClose={handleClosePaymentStatusDialog}
        status={status}
        orderNumber={orderNumber}
        trackingNumber={trackingNumber}
      />
      <LoadingComponent show={paymentIsLoading} />
    </orderContext.Provider>
  );
};

export default OrderContext;
