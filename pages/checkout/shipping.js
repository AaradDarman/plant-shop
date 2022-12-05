import React, { useContext, useEffect } from "react";

import Cookies from "cookies";
import isEmpty from "lodash/isEmpty";
import { Button, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

import MainLayout from "components/layouts/MainLayout";
import CheckoutLayout from "components/layouts/CheckoutLayout";
import { mapContext } from "context/map-context";
import MapContext from "context/MapContext";
import { orderContext } from "context/order-context";
import Icon from "components/shared/Icon";
import useBreakpoints from "utils/useBreakPoints";
import SwiperComponent from "components/shared/SwiperComponent";
import OrderItem from "components/profile/orders/OrderItem";

const Shipping = () => {
  const { openSelectAddressModal } = useContext(mapContext);
  const { selectedAddress } = useContext(orderContext);
  const { cart } = useSelector((state) => state);
  const { isLg } = useBreakpoints();

  useEffect(() => {
    isEmpty(selectedAddress) && openSelectAddressModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-1 flex-col">
      {!_.isEmpty(selectedAddress) ? (
        <>
          <div className="ml-0 flex items-center rounded-[4px] border-[1px] border-secondary-dark-800 p-[5px] sm:p-[1rem] md:ml-2">
            <>
              <Icon icon="location" size={24} className="ms-2 flex-shrink-0" />
              <div className="d-flex flex-column">
                <Typography
                  variant="body1"
                  component="div"
                  color="text.secondary"
                >
                  آدرس تحویل سفارش
                </Typography>
                <Typography variant="body1" component="div">
                  {`${selectedAddress?.province} - ${selectedAddress?.city} - ${selectedAddress?.postalAddress}`}
                </Typography>
                <Typography
                  variant="body1"
                  component="div"
                  color="text.secondary"
                >
                  {`${selectedAddress?.receiver?.fName} ${selectedAddress?.receiver?.lName}`}
                </Typography>
              </div>
              <Button
                variant="text"
                className="!mr-auto flex-shrink-0 !text-inherit hover:!text-accent-700"
                size="small"
                onClick={openSelectAddressModal}
              >
                تغییر | ویرایش
                <FontAwesomeIcon icon={faChevronLeft} width={19} />
              </Button>
            </>
          </div>
          <div className="mt-2 ml-0 flex rounded-[4px] border-[1px] border-secondary-dark-800 py-3 md:ml-2">
            <SwiperComponent items={cart.items} RenderComponent={OrderItem} />
          </div>
        </>
      ) : (
        <button className="edit-map-btn pe-4" onClick={openSelectAddressModal}>
          انتخاب آدرس
          <Icon icon="chevron-left" size={24} />
        </button>
      )}
    </section>
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
  return {
    props: {},
  };
}

Shipping.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <CheckoutLayout>
        <MapContext>{page}</MapContext>
      </CheckoutLayout>
    </MainLayout>
  );
};

export default Shipping;
