import React, { useContext } from "react";

import { Chip, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import { useTheme } from "styled-components";

import { numberWithCommas } from "utils/number-helper";
import Icon from "components/shared/Icon";
import { productContext } from "context/product-context";

const Item = ({ item }) => {
  const { addItemToCart, removeItemFromCart } = useContext(productContext);
  const { cart } = useSelector((state) => state);
  const theme = useTheme();

  const handleAddItemToCart = () => {
    if (item?.productStock <= item?.quantity) {
      toast.error("محصول به تعداد کافی موجود نیست", {
        position: "bottom-center",
        closeOnClick: true,
      });
    } else {
      addItemToCart({
        ...item,
        quantity: 1,
      });
    }
  };

  const handleRemoveItemFromCart = () => {
    removeItemFromCart({
      ...item,
      quantity: 1,
    });
  };

  const calculatePriceWithDiscount = () => {
    return item.price - (item.price * item.discount) / 100;
  };

  return (
    <div
      className="item flex flex-col items-stretch border-b-[1px] border-b-secondary-dark-800
       p-[0.8rem] last:border-b-0 sm:flex-row"
      key={item._id}
    >
      <div className="ml-[5px] min-w-[150px] rounded-md">
        <Image
          src={item.images[0]}
          alt="product-image"
          width={200}
          height={200}
          layout="responsive"
          className="rounded-md drop-shadow-xl"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMUdgx6DwACrAGXk7skvAAAAABJRU5ErkJggg=="
        />
      </div>
      <div className="flex flex-col items-start justify-around">
        <Typography gutterBottom variant="h5" component="h2">
          {item?.name}
        </Typography>
        <Typography gutterBottom variant="body1" component="div">
          {item?.size}
        </Typography>
        <div className="my-1 flex flex-col">
          {item?.discount != 0 && (
            <div>
              <Chip label={`${item.discount}%`} color="error" size="small" />
              <span className="mr-1 text-[14px] text-gray-400 line-through">
                {numberWithCommas(item?.price)}
              </span>
            </div>
          )}
          <span>{`${
            item.discount
              ? numberWithCommas(calculatePriceWithDiscount())
              : numberWithCommas(item?.price)
          } تومان`}</span>
        </div>
        <div className="self-center rounded-[4px] border-[1px] border-secondary-dark-800 sm:self-auto">
          <IconButton
            disabled={cart.status === "loading"}
            onClick={handleAddItemToCart}
            className="!text-[19px]"
          >
            <FontAwesomeIcon width={19} icon={faAdd} />
          </IconButton>
          {cart.status === "loading" ? (
            <PulseLoader
              className="!inline"
              size={3}
              color={theme.palette.accent.main}
              loading={true}
            />
          ) : (
            <span className="inline-block min-w-[21px] text-center">
              {item.quantity}
            </span>
          )}
          <IconButton
            onClick={handleRemoveItemFromCart}
            className="!text-[19px]"
            disabled={cart.status === "loading"}
          >
            {item.quantity > 1 ? (
              <FontAwesomeIcon width={19} icon={faMinus} />
            ) : (
              <Icon icon="delete" size={19} />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Item;
