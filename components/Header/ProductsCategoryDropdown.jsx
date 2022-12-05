import React from "react";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const ProductsCategoryDropdown = () => {
  const router = useRouter();
  const { products } = useSelector((state) => state);
  return (
    <Accordion
      className={`relative block w-full !rounded-none !bg-none px-[32px] transition-all !shadow-none ${
        router.pathname.startsWith("/products")
          ? "!bg-gray-500 !text-slate-900 dark:!bg-primary-900 dark:!text-slate-50"
          : " !bg-transparent !text-slate-400"
      }`}
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
        className={`!px-0 font-bold`}
      >
        محصولات
      </AccordionSummary>
      <AccordionDetails className="!p-0">
        {products.categories.map((category) => (
          <div className="flex" key={category.slug}>
            <Link href={`/products/${category.slug}`} passHref>
              <a
                className={`w-full py-2 px-2 font-bold ${
                  router.pathname.startsWith("/products")
                    ? "!text-slate-900 dark:!text-slate-50"
                    : "!text-slate-400"
                }`}
              >
                {category.name}
              </a>
            </Link>
          </div>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default ProductsCategoryDropdown;
