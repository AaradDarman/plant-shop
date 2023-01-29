import React from "react";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const ProductsCategoryAccordion = ({ onClick }) => {
  const router = useRouter();
  const { products } = useSelector((state) => state);
  return (
    <Accordion
      className={`relative block w-full !rounded-none !bg-transparent !bg-none !text-slate-400 transition-all !shadow-none`}
      sx={{
        "& .MuiAccordionSummary-root": {
          minHeight: "38px",
        },
        "&": {
          boxShadow: "none",
        },
        "& .MuiAccordionSummary-root.Mui-expanded": {
          minHeight: "38px",
        },
        "& .MuiAccordionSummary-content.Mui-expanded": {
          margin: 0,
        },
        "& .MuiAccordionSummary-content": {
          margin: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <FontAwesomeIcon
            icon={faChevronDown}
            width={12}
            className={`${
              router.pathname.startsWith("/products")
                ? "!text-slate-900 dark:!text-slate-50"
                : "!text-slate-400"
            }`}
          />
        }
        className={`!px-[32px] font-bold ${
          router.pathname.startsWith("/products")
            ? "!bg-gray-500 !text-slate-900 dark:!bg-primary-900 dark:!text-slate-50"
            : " !bg-transparent !text-slate-400"
        }`}
      >
        محصولات
      </AccordionSummary>
      <AccordionDetails className="!flex !flex-col !p-0">
        <Link href={`/products`} passHref>
          <a
            onClick={onClick}
            className={`w-full py-2 px-[34px] font-bold ${
              router.pathname === "/products"
                ? "!bg-gray-500 !text-slate-900 dark:!bg-primary-900 dark:!text-slate-50"
                : " !bg-transparent !text-slate-400"
            }`}
          >
            همه ی محصولات
          </a>
        </Link>
        {products.categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products/${category.slug}`}
            passHref
          >
            <a
              onClick={onClick}
              className={`flex w-full py-2 px-[34px] font-bold ${
                router?.query?.category === category.slug
                  ? "!bg-gray-500 !text-slate-900 dark:!bg-primary-900 dark:!text-slate-50"
                  : " !bg-transparent !text-slate-400"
              }`}
            >
              {category.name}
            </a>
          </Link>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default ProductsCategoryAccordion;
