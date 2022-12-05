import React, { useContext } from "react";

import Cookies from "cookies";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";

import MainLayout from "components/layouts/MainLayout";
const ProfileLayout = dynamic(() => import("components/layouts/ProfileLayout"));
import { decodeToken } from "utils/token-helper";
import { authContext } from "context/auth-context";
import AuthContext from "context/AuthContext";

const PersonalInfo = () => {
  const { user } = useSelector((state) => state);
  const { openEditPhoneNumberModal } = useContext(authContext);

  return (
    <div className="flex flex-wrap gap-y-[25px] py-[1rem] px-[2rem]">
      <Head>
        <title>پروفایل | اطلاعات حساب کاربری</title>
      </Head>
      <Typography
        variant="body1"
        className="flex flex-1 basis-full flex-col md:basis-[50%] md:px-5"
      >
        <span className="ml-[4px] text-gray-400">نام و نام خانوادگی</span>
        {`${user.user.fName} ${user.user.lName}`}
      </Typography>
      <Typography
        variant="body1"
        className="flex flex-1 basis-full flex-col md:basis-[50%] md:px-5"
      >
        <span className="ml-[4px] text-gray-400">ایمیل</span>
        {user.user.email}
      </Typography>
      <Typography
        variant="body1"
        className="relative flex flex-1 basis-full flex-col md:basis-[50%] md:px-5"
      >
        <span className="ml-[4px] text-gray-400">شماره موبایل</span>
        {user.user.phoneNumber}
        <FontAwesomeIcon
          className="absolute left-2 top-[50%] -translate-y-[50%] cursor-pointer"
          onClick={openEditPhoneNumberModal}
          icon={faPencil}
          width={19}
        />
      </Typography>
      <Typography
        variant="body1"
        className="flex flex-1 basis-full flex-col md:basis-[50%] md:px-5"
      >
        <span className="ml-[4px] text-gray-400">کد ملی</span>
        {user.user.personalCode}
      </Typography>
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
  return {
    props: {},
  };
}

PersonalInfo.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      <ProfileLayout>
        <AuthContext>{page}</AuthContext>
      </ProfileLayout>
    </MainLayout>
  );
};

export default PersonalInfo;
