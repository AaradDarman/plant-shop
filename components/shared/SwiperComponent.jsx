import React from "react";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import styled from "styled-components";
import PropTypes from "prop-types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const StyledSwiper = styled(Swiper)`
  padding: 2rem 0;
  .swiper-button-next,
  .swiper-button-prev {
    color: #005c0e;
  }
  .swiper-button-next {
    background-color: #007b23;
    mask-image: url("/images/chevron-left.svg");
    mask-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
  }
  .swiper-button-prev {
    background-color: #007b23;
    mask-image: url("/images/chevron-right.svg");
    mask-repeat: no-repeat;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
  }

  .swiper-button-next::after {
    display: none;
  }
  .swiper-button-prev::after {
    display: none;
  }

  svg {
    fill: #005c0e !important;
  }
`;

const SwiperComponent = ({ items, RenderComponent }) => {
  return true ? (
    <>
      <StyledSwiper
        dir="rtl"
        style={{ flex: 1, width: "200px" }}
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        autoHeight
        slidesOffsetAfter={10}
        slidesOffsetBefore={10}
        breakpoints={{
          0: {
            slidesPerView: 3,
          },
          330: {
            slidesPerView: 3,
          },
          500: {
            slidesPerView: 5,
          },
          720: {
            slidesPerView: 6,
          },
          1024: {
            slidesPerView: 10,
          },
        }}
        navigation
      >
        {items.map((item) => (
          <SwiperSlide key={item._id}>
            <RenderComponent
              item={item}
              className="delay-50 transition-transform md:scale-[0.9] md:hover:scale-100 xl:scale-[0.8]"
            />
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </>
  ) : null;
};

SwiperComponent.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SwiperComponent;
