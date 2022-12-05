import React, { useContext, useEffect } from "react";

import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import map from "lodash/map";

import MainLayout from "components/layouts/MainLayout";
import SidebarLayout from "components/layouts/SidebarLayout";
import ProductsContext from "context/ProductsContext";
import ProductsList from "components/Products";
import withPagination from "components/HOC/withPagination";
import { productsContext } from "context/products-context";
import SortProducts from "components/Products/SortProducts";
import api from "adapters/adapter";
import { convetUrlToStringFormat } from "utils/string-helper";

const ProductsWithPagination = withPagination(({ ...otherProps }) => (
  <ProductsList {...otherProps} />
));

const Category = ({ products, productsCount, categoryHierarchy }) => {
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
          {categoryHierarchy && map(categoryHierarchy, "name").join(" | ")}
        </title>
      </Head>
      <SortProducts className="hidden md:flex" onTabChange={handleSortChange} />
      <div className="flex items-center md:hidden">
        <IconButton
          onClick={openFilterModal}
          className="text-slate-900 dark:text-inherit"
        >
          <FontAwesomeIcon fixedWidth size="sm" icon={faFilter} />
        </IconButton>
        <IconButton onClick={openSortModal}>
          <FontAwesomeIcon
            fixedWidth
            size="sm"
            icon={faArrowDownWideShort}
            className="text-slate-900 dark:text-inherit"
          />
        </IconButton>
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
  const { data } = await api.getProductsByCategory(
    convetUrlToStringFormat(ctx.query.category),
    {
      page: ctx.query.page || 1,
      search: ctx.query.search || "",
      sortBy: ctx.query.sortBy || "newest",
      minPrice: ctx.query.minPrice,
      maxPrice: ctx.query.maxPrice,
      size: ctx.query.size,
      light: ctx.query.light,
    }
  );
  return {
    props: {
      products: data?.products,
      productsCount: data?.productsCount,
      categoryHierarchy: [
        { name: "محصولات", slug: `products` },
        { name: ctx.query.category, slug: `products/${ctx.query.category}` },
      ],
    },
  };
}

Category.getLayout = function getLayout(page) {
  return (
    <MainLayout {...page.props}>
      <ProductsContext>
        <SidebarLayout>{page}</SidebarLayout>
      </ProductsContext>
    </MainLayout>
  );
};

export default Category;
