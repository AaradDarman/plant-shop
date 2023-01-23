import React, { useContext, useEffect, useState } from "react";

import MainLayout from "components/layouts/MainLayout";
import {
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { getPlaiceholder } from "plaiceholder";
import { faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import Head from "next/head";
import _Map from "lodash/map";
import clsx from "clsx";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import { useTheme } from "styled-components";
import dynamic from "next/dynamic";

import { numberWithCommas } from "utils/number-helper";
import ProductSizeSelector from "components/ProductSizeSelector";
import ProductImage from "components/ProductImage";
import MyAccordion from "components/MyAccordion";
import Icon from "components/shared/Icon";
const ProductsSwiperComponent = dynamic(() =>
  import("components/shared/ProductsSwiperComponent")
);
import ProductContext from "context/ProductContext";
import { productContext } from "context/product-context";
import api from "adapters/adapter";
import { calculateDiscountedPrice } from "utils/product-helper";
import { isDiscountArrive } from "utils/date-helper";

const Product = ({
  product,
  suggestedProducts,
  imageSrces,
  categoryHierarchy,
}) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]?.label);
  const { addItemToCart, removeItemFromCart } = useContext(productContext);
  const { cart } = useSelector((state) => state);
  const theme = useTheme();
  const [productStock, setProductStock] = useState(1);
  const [hasStock, setHasStock] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [selectedItemPrice, setSelectedItemPrice] = useState(0);

  useEffect(() => {
    let pStock = getProductStock();
    setHasStock(pStock > 0);
    setProductStock(pStock);
    if (isDiscountArrive(product?.discount)) {
      setDiscount(
        product?.discount.includes.find((obj) => obj.size === selectedSize)
          ?.discount ?? 0
      );
    } else {
      setDiscount(0);
    }
    setSelectedItemPrice(
      product.inventory.find((stock) => stock.size === selectedSize)?.price
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize, product]);

  useEffect(() => {
    setSelectedSize(product?.sizes[0]?.label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);

  useEffect(() => {
    setSelectedSize(product?.sizes[0]?.label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);

  const updateViewCount = async () => {
    try {
      const { status, data } = await api.updateProductViewCount(product._id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    updateViewCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartItem = cart.items.find(
    (item) => item._id === product._id && item?.size == selectedSize
  );

  const getProductStock = () => {
    return product.inventory.find((stock) => stock.size === selectedSize)
      ?.quantity;
  };

  const handleAddItemToCart = () => {
    if (productStock <= cartItem?.quantity) {
      toast.error("محصول به تعداد کافی موجود نیست", {
        position: "bottom-center",
        closeOnClick: true,
      });
    } else {
      addItemToCart({
        ...product,
        size: selectedSize,
        price: selectedItemPrice,
        discount,
        quantity: 1,
        productStock,
      });
    }
  };

  const handleRemoveItemFromCart = () => {
    removeItemFromCart({
      ...product,
      size: selectedSize,
      quantity: 1,
    });
  };

  return (
    <>
      <Head>
        <title>
          {categoryHierarchy && _Map(categoryHierarchy, "name").join(" | ")}
        </title>
      </Head>
      <section className="grid min-h-[328px] grid-cols-5 p-2">
        <div className="order-2 col-span-5 flex flex-col justify-evenly md:order-1 md:col-span-2 md:ml-1 md:min-h-[538px]">
          <Typography gutterBottom variant="h4" component="h1">
            {product?.name}
          </Typography>
          <div className="my-4 flex flex-col">
            <Typography gutterBottom variant="h6" component="div">
              سایز:
            </Typography>
            <ProductSizeSelector
              className="py-2"
              sizes={product?.sizes?.map((size) => size.label)}
              selectedSize={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            />
          </div>
          <div className="hidden md:flex md:flex-col">
            {discount != 0 && (
              <div>
                <Chip label={`${discount}%`} color="error" size="small" />
                <span className="mr-1 text-[14px] text-gray-400 line-through">
                  {numberWithCommas(selectedItemPrice)}
                </span>
              </div>
            )}
            <span>{`${
              discount != 0
                ? numberWithCommas(
                    calculateDiscountedPrice(selectedItemPrice, discount)
                  )
                : numberWithCommas(selectedItemPrice)
            } تومان`}</span>
          </div>
          {hasStock && productStock <= 5 && (
            <Typography gutterBottom variant="caption" color="error">
              {`تنها ${productStock} عدد در انبار باقی مانده`}
            </Typography>
          )}
          {cartItem ? (
            <div className="hidden items-center justify-between md:flex">
              <div>
                <IconButton
                  disabled={cart.status === "loading"}
                  onClick={handleAddItemToCart}
                >
                  <FontAwesomeIcon icon={faAdd} />
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
                    {cartItem.quantity}
                  </span>
                )}
                <IconButton
                  disabled={cart.status === "loading"}
                  onClick={handleRemoveItemFromCart}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </IconButton>
              </div>
              <Typography gutterBottom variant="body1" component="div">
                {`${
                  discount != 0
                    ? numberWithCommas(
                        calculateDiscountedPrice(selectedItemPrice, discount) *
                          cartItem.quantity
                      )
                    : numberWithCommas(selectedItemPrice * cartItem.quantity)
                } تومان`}
              </Typography>
            </div>
          ) : (
            <Button
              variant="contained"
              classes={{
                root: "hover:!bg-accent-600 dark:hover:!bg-accent-800 !z-[2] !max-h-[40px] !rounded-md !py-2 !px-6 !hidden md:!inline-flex",
                disabled: `${
                  cart.status === "loading"
                    ? "!bg-accent-500"
                    : "!bg-black/[0.12] dark:!bg-white/[0.12]"
                }`,
              }}
              sx={{
                "&": {
                  backgroundColor: "accent.main",
                },
              }}
              onClick={handleAddItemToCart}
              endIcon={
                cart.status === "loading" || !hasStock ? null : (
                  <FontAwesomeIcon icon={faAdd} />
                )
              }
              disabled={cart.status === "loading" || !hasStock}
            >
              {cart.status === "loading" ? (
                <CircularProgress size={24} />
              ) : hasStock ? (
                "افزودن به سبد"
              ) : (
                "نا موجود"
              )}
            </Button>
          )}
          <div
            className={clsx(
              "proceed-btn-mobile fixed bottom-0 right-0 left-0 ",
              "z-[2] flex justify-between",
              "border-t-[1px] border-t-secondary-dark-800 bg-secondary-light py-3 px-4",
              "md:hidden",
              "dark:bg-secondary-dark-900"
            )}
          >
            {cartItem ? (
              <div className="flex items-center justify-between">
                <div>
                  <IconButton
                    disabled={cart.status === "loading"}
                    onClick={handleAddItemToCart}
                  >
                    <FontAwesomeIcon icon={faAdd} />
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
                      {cartItem.quantity}
                    </span>
                  )}
                  <IconButton
                    disabled={cart.status === "loading"}
                    onClick={handleRemoveItemFromCart}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </IconButton>
                </div>
              </div>
            ) : (
              <Button
                variant="contained"
                classes={{
                  root: "hover:!bg-accent-600 dark:hover:!bg-accent-800 !z-[2] !max-h-[40px] !rounded-md !py-2 !px-6",
                  disabled: `${
                    cart.status === "loading"
                      ? "!bg-accent-500"
                      : "!bg-black/[0.12] dark:!bg-white/[0.12]"
                  }`,
                }}
                sx={{
                  "&": {
                    backgroundColor: "accent.main",
                  },
                }}
                onClick={handleAddItemToCart}
                endIcon={
                  cart.status === "loading" || !hasStock ? null : (
                    <FontAwesomeIcon icon={faAdd} />
                  )
                }
                disabled={cart.status === "loading" || !hasStock}
              >
                {cart.status === "loading" ? (
                  <CircularProgress size={24} />
                ) : hasStock ? (
                  "افزودن به سبد"
                ) : (
                  "نا موجود"
                )}
              </Button>
            )}
            <div className="total-price flex flex-col">
              {discount != 0 && (
                <div>
                  <Chip label={`${discount}%`} color="error" size="small" />
                  <span className="mr-1 text-[14px] text-gray-400 line-through">
                    {numberWithCommas(selectedItemPrice)}
                  </span>
                </div>
              )}
              <span>{`${
                discount != 0
                  ? numberWithCommas(
                      calculateDiscountedPrice(selectedItemPrice, discount)
                    )
                  : numberWithCommas(selectedItemPrice)
              } تومان`}</span>
            </div>
          </div>
          <div className="flex justify-evenly py-4">
            <div className="flex flex-col items-center justify-center">
              <Icon icon="width" size={32} />
              <span className="mt-[2px] mb-[4px] font-semibold">قطر</span>
              <span>
                {
                  product?.sizes.find((size) => size.label === selectedSize)
                    ?.diameter
                }
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Icon icon="height" size={32} />
              <span className="mt-[2px] mb-[4px] font-semibold">ارتفاع</span>
              <span>
                ±
                {
                  product?.sizes.find((size) => size.label === selectedSize)
                    ?.height
                }
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Icon icon="sun" size={32} />
              <span className="mt-[2px] mb-[4px] font-semibold">نور</span>
              <span>{product?.light}</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Icon icon="water" size={32} />
              <span className="mt-[2px] mb-[4px] font-semibold">آب</span>
              <span>{product?.watering}</span>
            </div>
          </div>
          <MyAccordion title="توضیحات" className="px-2">
            <Typography
              variant="body1"
              className="text-slate-600 dark:text-slate-300"
            >
              {product?.description}
            </Typography>
          </MyAccordion>
          <MyAccordion title="مراقبت" className="px-2">
            <div className="mb-4 flex">
              <Icon
                icon="watering-can"
                size={32}
                className="ml-2 min-h-[32px] min-w-[32px]"
              />
              <Typography
                variant="body1"
                className="text-slate-600 dark:text-slate-300"
              >
                {product?.care.watering}
              </Typography>
            </div>
            <div className="mb-4 flex">
              <Icon
                icon="light"
                size={32}
                className="ml-2 min-h-[32px] min-w-[32px]"
              />
              <Typography
                variant="body1"
                className="text-slate-600 dark:text-slate-300"
              >
                {product?.care.light}
              </Typography>
            </div>
          </MyAccordion>
        </div>
        <div className="top-[55px] order-1 col-span-5 md:sticky md:order-2 md:col-span-3 md:h-fit md:min-h-[538px]">
          {imageSrces && <ProductImage images={imageSrces} />}
        </div>
      </section>
      <Typography
        variant="h5"
        component="h4"
        className="mt-4 border-t-2 border-t-secondary-dark-800 pt-4 text-center"
      >
        پیشنهادی
      </Typography>
      <ProductsSwiperComponent products={suggestedProducts} />
    </>
  );
};

export const getStaticPaths = async () => {
  try {
    const { data } = await api.getProductsIds();
    const paths = data.ids.map((id) => ({
      params: { id: id._id },
    }));
    return { paths, fallback: true };
  } catch (e) {
    return e;
  }
};

export const getStaticProps = async ({ params }) => {
  try {
    const { status, data } = await api.getProduct(params.id);
    const imageSrces = await Promise.all(
      data.product.images.map(async (imageSrc) => {
        const imageData = await getPlaiceholder(imageSrc);
        return { blurDataURL: imageData.base64, ...imageData.img };
      })
    );
    return {
      props: {
        product: data.product,
        suggestedProducts: data.suggestedProducts ?? [],
        imageSrces,
        categoryHierarchy: data.product.categoryHierarchy,
      },
      // revalidate: 120,
    };
  } catch (e) {
    return e;
  }
};

Product.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <ProductContext> {page}</ProductContext>
    </MainLayout>
  );
};

export default Product;
