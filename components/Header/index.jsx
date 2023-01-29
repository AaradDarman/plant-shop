import { useEffect, useState } from "react";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import isEmpty from "lodash/isEmpty";

import ThemeToggler from "components/ThemeToggler";
import Icon from "components/shared/Icon";
import MyPopover from "components/shared/MyPopover";

const NavigationDrawer = dynamic(() => import("./NavigationDrawer"), {
  ssr: false,
});
const CartItemsIcon = dynamic(() => import("./CartItemsIcon"), { ssr: false });
const ProductsCategoryDropdown = dynamic(
  () => import("./ProductsCategoryDropdown"),
  { ssr: false }
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const { user, products } = useSelector((state) => state);

  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`header min-h-[55px] ${
          offset > 10 ? "bg-white dark:bg-primary-800" : "bg-transparent"
        } sticky top-0 z-20 transition-all`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <Link href="/" passHref>
            <a className="logo order-2 font-bold md:order-1">My Plants</a>
          </Link>
          <nav className="order-3 hidden md:order-2 md:block">
            <ul className="flex">
              <li className="flex">
                <Link href="/" passHref>
                  <a
                    className={`py-2 px-3 font-bold ${
                      router.pathname === "/"
                        ? " border-b-2 border-b-accent-400 text-slate-900 border-b-solid dark:text-slate-50"
                        : "text-slate-400 hover:text-accent-700"
                    }`}
                  >
                    صفحه اصلی
                  </a>
                </Link>
              </li>
              <li className="flex">
                <ProductsCategoryDropdown categories={products.categories} />
              </li>
              <li className="flex">
                <Link href="/about" passHref>
                  <a
                    className={`py-2 px-3 font-bold ${
                      router.pathname === "/about"
                        ? " border-b-2 border-b-accent-400 text-slate-900 border-b-solid dark:text-slate-50"
                        : "text-slate-400 hover:text-accent-700"
                    }`}
                  >
                    درباره ما
                  </a>
                </Link>
              </li>
              <li className="flex">
                <Link href="/contact-us" passHref>
                  <a
                    className={`py-2 px-3 font-bold ${
                      router.pathname === "/contact-us"
                        ? " border-b-2 border-b-accent-400 text-slate-900 border-b-solid dark:text-slate-50"
                        : "text-slate-400 hover:text-accent-700"
                    }`}
                  >
                    ارتباط با ما
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="order-3 flex items-center">
            <CartItemsIcon />
            {isEmpty(user?.user) ? (
              <>
                <Link href="/users/login" passHref>
                  <a className="hidden rounded-full bg-accent-600 py-2 px-4 text-white transition-colors ease-in-out hover:bg-accent-900 hover:text-white md:inline-block">
                    ورود/ثبت نام
                  </a>
                </Link>
                <Link href="/users/login" passHref>
                  <a>
                    <Icon
                      icon="profile"
                      size={24}
                      className="ml-2 !block md:ml-0 md:!hidden"
                    />
                  </a>
                </Link>
              </>
            ) : (
              <Link href="/profile" passHref>
                <a className="hover:text-accent-700">
                  <Icon icon="profile" size={24} className="ml-2 md:ml-0" />
                </a>
              </Link>
            )}
            <ThemeToggler />
          </div>
          <NavigationDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
          <button className="order-1 block h-8 w-8 md:hidden">
            <FontAwesomeIcon
              fixedWidth
              size="lg"
              icon={faBars}
              onClick={() => setIsOpen(true)}
            />
          </button>
        </div>
      </header>
      {router.pathname !== "/" && (
        <div className="sticky top-[55px] left-0 right-0 h-[1px] bg-secondary-dark-800" />
      )}
    </>
  );
};

export default Header;
