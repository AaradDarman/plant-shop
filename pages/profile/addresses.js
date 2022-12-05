import React, { useContext } from "react";

import { Button, Typography } from "@mui/material";
import Cookies from "cookies";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Head from "next/head";
import dynamic from "next/dynamic";

import MainLayout from "components/layouts/MainLayout";
const ProfileLayout = dynamic(() => import("components/layouts/ProfileLayout"));
import Icon from "components/shared/Icon";
import { decodeToken } from "utils/token-helper";
import { mapContext } from "context/map-context";
import MapContext from "context/MapContext";

const AddressActionsPopover = dynamic(() =>
  import("components/profile/addresses/AddressActionsPopover")
);

const StyledWraper = styled.div``;

const Addresses = () => {
  const { user } = useSelector((state) => state);
  const { openAddAddressModal, openDeleteAddressModal, openEditAddressModal } =
    useContext(mapContext);

  return (
    <StyledWraper>
      <Head>
        <title>پروفایل | آدرس ها</title>
      </Head>
      <div className="flex items-center justify-between p-3">
        <Typography
          variant="h6"
          className="border-b-[2px] border-b-accent-600 dark:border-b-accent-500"
        >
          آدرس ها
        </Typography>
        <Button
          variant="outlined"
          className="border !border-accent-600/50 !bg-transparent !text-accent-600 hover:!border-accent-600 hover:!bg-accent-600/[.08]"
          onClick={openAddAddressModal}
        >
          ثبت آدرس جدید
          <Icon icon="location" size={24} />
        </Button>
      </div>
      {user.user.addresses &&
        user.user.addresses.map((address) => (
          <div
            className="border-solid border-b-secondary-dark-200 p-[13px] first:border-none dark:border-b-secondary-dark-800 [&:not(last)]:border-b-[1px]"
            key={address._id}
          >
            <div className="flex items-center justify-between py-1">
              <span> {`${address.city} - ${address.postalAddress}`}</span>
              <AddressActionsPopover
                address={address}
                onDeleteClick={() => openDeleteAddressModal(address._id)}
                onEditClick={() => openEditAddressModal(address)}
              />
            </div>
            <div className="flex flex-col">
              <div className="py-1 text-gray-400">
                <Icon icon="address" size={20} className="ml-[4px]" />
                {address.city}
              </div>
              <div className="py-1 text-gray-400">
                <Icon icon="post" size={22} className="ml-[4px]" />
                {address?.postalCode}
              </div>
              <div className="py-1 text-gray-400">
                <Icon icon="call" size={20} className="ml-[4px]" />
                {address.receiver.phoneNumber}
              </div>
              <div className="py-1 text-gray-400">
                <Icon icon="profile" size={20} className="ml-[4px]" />
                {`${address.receiver.fName} ${address.receiver.lName}`}
              </div>
            </div>
          </div>
        ))}
    </StyledWraper>
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

Addresses.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <ProfileLayout>
        <MapContext>{page}</MapContext>
      </ProfileLayout>
    </MainLayout>
  );
};

export default Addresses;
