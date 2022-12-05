import React from "react";

import styled from "styled-components";
import { Typography } from "@mui/material";
import Image from "next/image";

import { numberWithCommas } from "utils/number-helper";
import { calculateDiscountedPrice } from "utils/product-helper";

const StyledWraper = styled.div`
  display: flex;
  align-items: stretch;
  padding: 0.8rem;
  .image-wraper {
    position: relative;
  }
  .item-quantity {
    position: absolute;
    bottom: 15px;
    left: 10px;
    min-width: 20px;
    height: 20px;
    line-height: 1.2;
    font-size: 1rem;
    text-align: center;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.palette.secondary.light};
  }
  .item-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
  }
`;

const OrderDetails = ({ item }) => {
  return (
    <StyledWraper
      className="order-item border-solid border-t-secondary-dark-200 first:border-none dark:border-t-secondary-dark-800 [&:not(last)]:border-t-[1px]"
      key={item._id}
    >
      <div className="image-wraper">
        <Image
          src={item.images[0]}
          alt="product-image"
          width={200}
          height={200}
        />
        <div className="item-quantity">{item.quantity}</div>
      </div>
      <div className="item-info">
        <Typography gutterBottom variant="h5" component="h2">
          {item?.name}
        </Typography>
        <Typography gutterBottom variant="body1" component="div">
          {item?.size}
        </Typography>
        <Typography gutterBottom variant="body1" component="div">
          {item?.color}
        </Typography>
        {item?.discount != 0 && (
          <div>
            <span className="mr-1 text-[14px] text-gray-400 line-through">
              {numberWithCommas(item?.price)}
            </span>
          </div>
        )}
        <Typography gutterBottom variant="body1" component="div">
          {`${
            item.discount
              ? numberWithCommas(
                  calculateDiscountedPrice(item.price, item.discount)
                )
              : numberWithCommas(item?.price)
          } تومان`}
        </Typography>
      </div>
    </StyledWraper>
  );
};

export default OrderDetails;
