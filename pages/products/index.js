import React, { useContext, useEffect } from "react";

import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import _Map from "lodash/map";
import { Button } from "@mui/material";

import MainLayout from "components/layouts/MainLayout";
import SidebarLayout from "components/layouts/SidebarLayout";
import ProductsContext from "context/ProductsContext";
import { productsContext } from "context/products-context";
import SortProducts from "components/Products/SortProducts";
import withPagination from "components/HOC/withPagination";
import ProductsList from "components/Products";
import api from "adapters/adapter";
import { PulseLoader } from "react-spinners";

const sortOptions = {
  newest: "جدیدترین",
  bestSelling: "پرفروش ترین",
  mostVisited: "پر بازدیدترین",
  cheapest: "ارزانترین",
  mostExpensive: "گرانترین",
};

const ProductsWithPagination = withPagination(({ ...otherProps }) => (
  <ProductsList {...otherProps} />
));

const Products = ({ products, productsCount, categoryHierarchy }) => {
  const router = useRouter();

  const {
    openFilterModal,
    openSortModal,
    handleSortChange,
    handlePageChange,
    setFilteredProductsCount,
  } = useContext(productsContext);

  useEffect(() => {
    setFilteredProductsCount(productsCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsCount]);

  return (
    <>
      <Head>
        <title>
          {categoryHierarchy && _Map(categoryHierarchy, "name").join(" | ")}
        </title>
      </Head>
      <SortProducts className="hidden md:flex" onTabChange={handleSortChange} />
      <div className="flex items-center md:hidden">
        <Button
          onClick={openFilterModal}
          className="!text-[14px]  !text-inherit hover:!text-accent-700"
          startIcon={<FontAwesomeIcon width={19} icon={faFilter} />}
        >
          فیلتر
        </Button>
        <Button
          variant="text"
          className="!text-[14px] !text-inherit hover:!text-accent-700"
          onClick={openSortModal}
          startIcon={<FontAwesomeIcon width={19} icon={faArrowDownWideShort} />}
        >
          {!router.query.sortBy ? "جدیدترین" : sortOptions[router.query.sortBy]}
        </Button>
        <div className="mr-auto flex items-center text-[13px]">
          {productsCount}
          محصول
        </div>
      </div>
      <ProductsWithPagination
        itemsPerPage={12}
        totalItems={productsCount}
        handleChangePage={handlePageChange}
        currentPage={+router?.query?.page || 1}
        products={products}
      />
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { data } = await api.getProducts({
    page: ctx.query.page || 1,
    search: ctx.query.search || "",
    sortBy: ctx.query.sortBy || "newest",
    minPrice: ctx.query.minPrice,
    maxPrice: ctx.query.maxPrice,
    size: ctx.query.size,
    light: ctx.query.light,
  });

  return {
    props: {
      products: data.products,
      productsCount: data.productsCount,
      categoryHierarchy: [{ name: "محصولات", slug: `/products` }],
    },
  };
}

Products.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <ProductsContext>
        <SidebarLayout>{page}</SidebarLayout>
      </ProductsContext>
    </MainLayout>
  );
};

export default Products;
