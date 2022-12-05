import React, { memo } from "react";

import styled, { css } from "styled-components";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch } from "react-redux";

import Icon from "components/shared/Icon";
import { resetUser } from "redux/slices/user";
import { resetLocalCart } from "redux/slices/cart";
import useBreakpoints from "utils/useBreakPoints";
import { useTheme } from "@mui/material";
import clsx from "clsx";

const stickyStyle = css`
  position: sticky;
  top: 58px;
`;

const StyledAside = styled.nav`
  width: ${({ isLg }) => (isLg ? "205px" : "100%")};
  margin-top: ${({ isLg }) => !isLg && "1rem"};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.palette.secondary[800]};
  border-radius: 4px;
  overflow-x: hidden;
  z-index: 1;
  display: flex;
  flex-direction: column;
  ${({ isLg }) => isLg && stickyStyle};
  .navigation-menu {
    list-style: none;
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-bottom: 0;
    padding: 0;
  }
  .menu-item {
    display: flex;
    align-items: center;
    width: inherit;
    position: relative;
    opacity: 0.7;
    margin: 0.6rem 0;
    padding: 0 0.7rem;
    transition: color 0.6s ease, background-color 0.3s ease, border 0.6s ease,
      opacity 0.3s;
  }
  .menu-item:not(.active):hover {
    opacity: 1;
    transition: color 0.3s ease;
  }
  .menu-item:not(.active):hover a {
    background-color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.primary[800]
        : "rgba(0, 0, 0, 0.1)"};
  }
  .menu-item:not(.active):hover a .icon {
    color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.accent[900]
        : theme.palette.accent[600]};
    transition: color 0.3s ease;
  }
  .menu-item:not(.active):hover a span::after {
    background-color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.accent[900]
        : theme.palette.accent[600]};
    width: 100%;
  }
  .menu-item.active a span::after {
    background-color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.accent[900]
        : theme.palette.accent[600]};
    width: 100%;
  }
  .menu-item.active a .icon {
    color: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.accent[900]
        : theme.palette.accent[600]};
  }
  .menu-item.active {
    opacity: 1;
  }
  .menu-item a {
    text-decoration: none;
    color: inherit;
    width: 100%;
    flex: 1;
    padding: 0.3rem;
    border-radius: 0.6rem;
    transition: all 0.3s ease;
  }
  .menu-item a span {
    position: relative;
  }
  .menu-item a span::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    width: 0;
    background-color: transparent;
    transition: all 0.3s ease;
  }
  .menu-item .icon {
    margin-left: 1rem;
  }
`;

const routesTitles = {
  "/profile": "",
  "/profile/orders": "| سفارش ها",
  "/profile/addresses": "| آدرس ها",
  "/profile/personal-info": "| اطلاعات حساب کاربری",
};

const ProfileLayout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLg } = useBreakpoints();
  const theme = useTheme();

  const logout = async (e) => {
    e.preventDefault();
    try {
      await axios.get("/api/auth/logout");
      dispatch(resetUser());
      dispatch(resetLocalCart());
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-wrap-reverse items-start py-4 lg:flex-wrap">
      <Head>
        <title>{`پروفایل ${
          router.pathname.includes("/profile/orders")
            ? routesTitles["/profile/orders"]
            : routesTitles[router.pathname]
        }`}</title>
      </Head>
      <StyledAside theme={theme} isLg={isLg}>
        <ul className="navigation-menu">
          <li
            className={`menu-item${
              router.pathname === "/profile" ? " active" : ""
            }`}
          >
            <Link href="/profile">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/profile" ? "home-fill" : "home"
                  }`}
                  size={22}
                />
                <span>خلاصه فعالیت ها</span>
              </a>
            </Link>
          </li>
          <li
            className={`menu-item${
              router.pathname.includes("/profile/orders") ? " active" : ""
            }`}
          >
            <Link href="/profile/orders">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/profile/orders"
                      ? "shopping-bag-filled"
                      : "shopping-bag"
                  }`}
                  size={24}
                />
                <span>سفارش ها</span>
              </a>
            </Link>
          </li>
          <li
            className={`menu-item${
              router.pathname === "/profile/addresses" ? " active" : ""
            }`}
          >
            <Link href="/profile/addresses">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/profile/addresses"
                      ? "address-filled"
                      : "address"
                  }`}
                  size={24}
                />
                <span>آدرس ها</span>
              </a>
            </Link>
          </li>
          <li
            className={`menu-item${
              router.pathname === "/profile/personal-info" ? " active" : ""
            }`}
          >
            <Link href="/profile/personal-info">
              <a>
                <Icon
                  className="icon"
                  icon={`${
                    router.pathname === "/profile/personal-info"
                      ? "profile-filled"
                      : "profile"
                  }`}
                  size={24}
                />
                <span>اطلاعات حساب کاربری</span>
              </a>
            </Link>
          </li>
          <li className="menu-item">
            <Link href="/logout">
              <a
                onClick={logout}
              >
                <Icon className="icon" icon="logout" size={22} />
                <span>خروج</span>
              </a>
            </Link>
          </li>
        </ul>
      </StyledAside>
      <section
        className={clsx(
          "profile-main-section relative mr-0 min-h-[288px]",
          "flex-1 rounded-[4px] border-[1px] border-secondary-dark-200",
          "dark:border-secondary-dark-800",
          "lg:mr-2"
        )}
      >
        {children}
      </section>
    </div>
  );
};

export default memo(ProfileLayout);
