import React, { useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { orderContext } from "./order-context";
import PaymentStatusDialog from "components/modals/PaymentStatusDialog";
import userApi from "adapters/user-adapter";

const OrderContext = ({ children }) => {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [status, setStatus] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const getOrders = async () => {
    setIsLoading(true);
    try {
      const { data, status } = await userApi.getUserOrders(
        user.user._id,
        router.query.activeTab
      );
      if (status === 200) {
        setIsLoading(false);
        setOrders(data.orders);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

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
    try {
      const { data, status } = await axios.post("/api/order", {
        client: user.user._id,
        address: selectedAddress,
      });
      if (status === 200) {
        router.push(data.paymentUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const payBill = async (orderId) => {
    try {
      const { data, status } = await axios.post("/api/order/pay", {
        orderId,
      });
      if (status === 200) {
        router.push(data.paymentUrl);
      }
    } catch (error) {
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
        getOrders,
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
    </orderContext.Provider>
  );
};

export default OrderContext;
