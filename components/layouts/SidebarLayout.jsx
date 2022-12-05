import React, { useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Icon from "components/shared/Icon";
import { productsContext } from "context/products-context";
import PriceRange from "components/PriceRange";
import MyAccordion from "components/MyAccordion";
import { Checkbox, FormControlLabel, useTheme } from "@mui/material";

const ProductLights = ["مستقیم", "غیر مستقیم", "کم"];

const StyledInputWraper = styled.form`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.accent.main};
  background-color: ${({ theme }) => theme.palette.secondary.main};
  padding: 10px 4px;
`;

const StyledInput = styled.input`
  all: unset;
  padding: 2px 4px;
  color: ${({ theme }) => theme.palette.text.primary};
  ::placeholder {
    font-size: 14px;
  }
`;

const SidebarLayout = ({ children }) => {
  const router = useRouter();
  const { size, light, minPrice, maxPrice, search } = router.query;
  const { products } = useSelector((state) => state);
  const [searchTerm, setSearchTerm] = useState(search);
  const theme = useTheme();

  const {
    handleSizeFilterChange,
    handleLightFilterChange,
    handlePriceRangeFilterChange,
    handleSearchChange,
  } = useContext(productsContext);

  useEffect(() => {
    if (search) {
      setSearchTerm(search);
    } else {
      setSearchTerm("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <div className="sidebar-layout my-2 flex min-h-[328px]">
      <aside className="sticky top-[55px] hidden h-fit min-h-[538px] min-w-[200px] rounded-md border border-secondary-dark-800 p-1 md:block lg:min-w-[300px]">
        <StyledInputWraper
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchChange(searchTerm);
          }}
          className="mx-2 my-2 rounded-sm"
        >
          <Icon
            icon="search"
            size={24}
            onClick={() => {
              if (searchTerm) handleSearchChange(searchTerm);
            }}
          />
          <StyledInput
            type="text"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm ?? ""}
            placeholder="جستجوی محصول"
            className="!flex-1"
          />
          {searchTerm && (
            <Icon
              icon="remove"
              size={24}
              onClick={() => {
                setSearchTerm("");
                handleSearchChange("");
              }}
            />
          )}
        </StyledInputWraper>
        <h6 className="text-xl font-semibold">فیلتر ها</h6>
        <MyAccordion buttonClassName="py-2" title="سایز" open={size?.length}>
          {products.sizes.map((item) => (
            <FormControlLabel
              key={item}
              className="!mx-0 !flex flex-row-reverse !items-center justify-between"
              control={
                <Checkbox
                  checked={
                    Array.isArray(size) ? size?.includes(item) : size === item
                  }
                  sx={{
                    // color: pink[800],
                    "&.Mui-checked": {
                      color:
                        theme.palette.mode === "dark"
                          ? "accent.main"
                          : "accent.600",
                    },
                  }}
                  alignIndicator="right"
                  onChange={() => handleSizeFilterChange(item)}
                />
              }
              label={item}
            />
          ))}
        </MyAccordion>
        <MyAccordion buttonClassName="py-2" title="نور" open={light?.length}>
          {ProductLights.map((item) => (
            <FormControlLabel
              key={item}
              className="!mx-0 !flex flex-row-reverse !items-center justify-between"
              control={
                <Checkbox
                  checked={
                    Array.isArray(light)
                      ? light?.includes(item)
                      : light === item
                  }
                  sx={{
                    // color: pink[800],
                    "&.Mui-checked": {
                      color:
                        theme.palette.mode === "dark"
                          ? "accent.main"
                          : "accent.600",
                    },
                  }}
                  alignIndicator="right"
                  onChange={() => handleLightFilterChange(item)}
                />
              }
              label={item}
            />
          ))}
        </MyAccordion>
        <MyAccordion
          buttonClassName="py-2"
          title="محدوده قیمت"
          open={minPrice || maxPrice}
        >
          <PriceRange
            min={products.cheapest}
            max={products.mostExpensive}
            onRangeChange={handlePriceRangeFilterChange}
            range={[
              minPrice ? minPrice : products.cheapest,
              maxPrice ? maxPrice : products.mostExpensive,
            ]}
          />
        </MyAccordion>
      </aside>
      <main className="flex min-h-[538px] flex-1 flex-col p-2">{children}</main>
    </div>
  );
};

export default SidebarLayout;
