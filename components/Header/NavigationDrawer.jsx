import React, { useEffect } from "react";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const ProductsCategoryDropdown = dynamic(
  () => import("./ProductsCategoryAccordion"),
  {
    ssr: false,
  }
);

const NavigationDrawer = ({ isOpen, setIsOpen }) => {
  const router = useRouter();

  return (
    <div
      className={
        " fixed inset-0 z-10 transform overflow-hidden bg-gray-900 bg-opacity-25 ease-in-out " +
        (isOpen
          ? " translate-x-0 opacity-100 transition-opacity duration-200  "
          : " translate-x-full opacity-0  transition-all delay-150 duration-200  ")
      }
    >
      <section
        className={
          "absolute right-0 h-full w-screen max-w-[200px] transform bg-secondary-light  transition-all duration-200 ease-in-out dark:bg-primary-800  " +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <article className="relative flex h-full w-screen max-w-[200px] flex-col space-y-6 pb-10">
          <header className="p-4 text-lg font-bold">
            <button className="h-8 w-8">
              <FontAwesomeIcon
                fixedWidth
                size="lg"
                icon={faXmark}
                onClick={() => setIsOpen(false)}
              />
            </button>
          </header>
          <nav>
            <ul className="flex flex-col">
              <li className="flex flex-1">
                <Link href="/" passHref>
                  <a
                    onClick={() => setIsOpen(false)}
                    className={`w-full py-2 px-8 font-bold ${
                      router.pathname === "/"
                        ? "bg-gray-500 text-slate-900 dark:bg-primary-900 dark:text-slate-50"
                        : "text-slate-400"
                    }`}
                  >
                    صفحه اصلی
                  </a>
                </Link>
              </li>
              <li className="flex flex-1">
                <ProductsCategoryDropdown onClick={() => setIsOpen(false)} />
              </li>
              <li className="flex flex-1">
                <Link href="/about" passHref>
                  <a
                    onClick={() => setIsOpen(false)}
                    className={`w-full py-2 px-8 font-bold ${
                      router.pathname === "/about"
                        ? "bg-gray-500 text-slate-900 dark:bg-primary-900 dark:text-slate-50"
                        : "text-slate-400"
                    }`}
                  >
                    درباره ما
                  </a>
                </Link>
              </li>
              <li className="flex flex-1">
                <Link href="/contact-us" passHref>
                  <a
                    onClick={() => setIsOpen(false)}
                    className={`w-full py-2 px-8 font-bold ${
                      router.pathname === "/contact-us"
                        ? "bg-gray-500 text-slate-900 dark:bg-primary-900 dark:text-slate-50"
                        : "text-slate-400"
                    }`}
                  >
                    ارتباط با ما
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="!mt-auto flex justify-center py-2 px-8">
            <Link href="/users/login" passHref>
              <a className="rounded-full bg-accent-600 py-2 px-4 text-white transition-colors ease-in-out hover:bg-accent-900 hover:text-white">
                ورود/ثبت نام
              </a>
            </Link>
          </div>
        </article>
      </section>
      <section
        className=" h-full w-screen cursor-pointer "
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </div>
  );
};

export default NavigationDrawer;
