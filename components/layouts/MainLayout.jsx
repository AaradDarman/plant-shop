import React, { useEffect } from "react";

import Head from "next/head";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Footer from "components/Footer";
import Header from "components/Header";
import NavigationDrawer from "components/Header/NavigationDrawer";
import MyBreadCrumbs from "components/MyBreadcrumbs";
import userApi from "adapters/user-adapter";
import OrderContext from "context/OrderContext";
import { setUser } from "redux/slices/user";
import { setLocalCartItems, syncCartToDb } from "redux/slices/cart";
import { loadState } from "utils/browser-storage";

const MainLayout = ({ children, ...otherProps }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state);

  const getUserData = async () => {
    try {
      const { data, status } = await userApi.getUserData();
      if (status === 200) {
        dispatch(setUser(data.user));
        let localBasket = loadState();
        if (!isEmpty(localBasket?.items)) {
          dispatch(syncCartToDb(localBasket?.items));
        } else if (data.user.basket.length) {
          dispatch(setLocalCartItems(data.user.basket));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isEmpty(user.user)) {
      getUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.user]);

  return (
    <OrderContext>
      <Head>
        <title>
          {otherProps.categoryHierarchy &&
            map(otherProps.categoryHierarchy, "name").join(" | ")}
        </title>
      </Head>
      <Header />
      {otherProps.categoryHierarchy && (
        <MyBreadCrumbs breadcrumbs={[...otherProps.categoryHierarchy]} />
      )}
      <div className="main-layout mx-auto px-4 lg:container">
        <NavigationDrawer />
        {children}
        {router.pathname.includes("/profile") ? null : <Footer />}
      </div>
    </OrderContext>
  );
};

export default MainLayout;
