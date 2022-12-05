import React, { useContext, useState, useEffect } from "react";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Chip } from "@mui/material";

import { numberWithCommas } from "utils/number-helper";
import { productContext } from "context/product-context";
import {
  calculateDiscountedPrice,
  getDiscountsRange,
  getMaxDiscount,
} from "utils/product-helper";
import { shorten } from "utils/string-helper";

const Product = ({
  name,
  description,
  inventory,
  sizes,
  images,
  _id,
  className,
  discount,
}) => {
  const [maxDiscount, setMaxDiscount] = useState({});
  const [maxPrice, setMaxPrice] = useState(0);
  const [hasStock, setHasStock] = useState(true);

  useEffect(() => {
    let pStock = getProductStock();
    setHasStock(pStock.some((stock) => stock > 0));
    if (discount) {
      setMaxDiscount(getMaxDiscount(discount.includes));
      setMaxPrice(
        inventory?.find(
          (stock) => stock.size === getMaxDiscount(discount.includes).size
        )?.price
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductStock = () => {
    return inventory.map((stock) => stock.quantity);
  };

  return (
    <article
      className={`product relative flex h-[310px] flex-col md:h-[270px] ${className} rounded-2xl bg-secondary-light p-4 dark:bg-secondary-dark-800 sm:p-8`}
    >
      <button className="absolute top-2 right-2 h-8 w-8 text-slate-600">
        <FontAwesomeIcon fixedWidth size="lg" icon={faHeart} />
      </button>
      <Link href={`/product/${_id}`} passHref>
        <a className="flex flex-1 flex-col hover:text-inherit">
          <div className="absolute left-0 -top-[85px] md:-left-12">
            <Image
              src={images[0]}
              alt="plant"
              width={250}
              height={250}
              className={`drop-shadow-2x ${!hasStock && "grayscale"}`}
            />
          </div>
          <div className="mt-40 flex flex-col md:ml-28 md:mt-0">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="py-1 text-gray-400">{shorten(description, 80)}</p>
          </div>
          {hasStock ? (
            <div className="my-[15px] mt-auto flex justify-between font-bold">
              {discount && (
                <Chip
                  label={`${
                    discount && getMaxDiscount(discount?.includes).discount
                  }%`}
                  color="error"
                  size="small"
                />
              )}
              <div className="flex flex-col">
                <span>{`${
                  discount
                    ? numberWithCommas(
                        calculateDiscountedPrice(maxPrice, maxDiscount.discount)
                      )
                    : numberWithCommas(
                        inventory?.find(
                          (stock) => stock.size === sizes[0].label
                        ).price
                      )
                } تومان`}</span>
                {discount && (
                  <span className="text-[14px] text-gray-400 line-through">
                    {numberWithCommas(maxPrice)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="my-[15px] mt-auto flex justify-center font-bold">
              <span>نا موجود</span>
            </div>
          )}
        </a>
      </Link>
    </article>
  );
};

export default Product;
