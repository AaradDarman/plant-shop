import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "adapters/analytics-adapter";

import { toast } from "react-toastify";

export const getRecentOrders = createAsyncThunk(
  "analytics/recent-orders",
  async ({ search, sortBy, desc }) => {
    try {
      const { status, data } = await api.getRecentOrders(search, sortBy, desc);
      if (status === 200) {
        return data.recentOrders;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const getProductsStock = createAsyncThunk(
  "analytics/products-stock",
  async ({ search, sortBy, desc }) => {
    try {
      const { status, data } = await api.getProductsStock(search, sortBy, desc);
      if (status === 200) {
        return data;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const loadMoreProductsStock = createAsyncThunk(
  "analytics/load-more-products-stock",
  async ({ search, sortBy, desc, skip }) => {
    try {
      const { status, data } = await api.getProductsStock(
        search,
        sortBy,
        desc,
        skip
      );
      if (status === 200) {
        return data;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

export const getIncome = createAsyncThunk(
  "analytics/get-income",
  async (range) => {
    try {
      const { status, data } = await api.getIncome(range);
      if (status === 200) {
        return data;
      }
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "bottom-center",
        closeOnClick: true,
      });
    }
  }
);

// Slice
const slice = createSlice({
  name: "analytics",
  initialState: {
    recentOrders: { status: "idle", entity: [] },
    productsStock: { status: "idle", entity: [], totalCount: 0 },
    income: {
      status: "idle",
      entity: [],
      range: [],
    },
  },
  reducers: {},
  extraReducers: {
    [getRecentOrders.fulfilled]: (state, action) => {
      state.recentOrders.entity = action.payload;
      state.recentOrders.status = "idle";
    },
    [getRecentOrders.pending]: (state) => {
      state.recentOrders.status = "loading";
    },
    [getProductsStock.fulfilled]: (state, action) => {
      state.productsStock.entity = action.payload.productsStock;
      state.productsStock.totalCount = action.payload.totalCount;
      state.productsStock.status = "idle";
    },
    [getProductsStock.pending]: (state) => {
      state.productsStock.status = "loading";
    },
    [loadMoreProductsStock.fulfilled]: (state, action) => {
      state.productsStock.entity = [
        ...state.productsStock.entity,
        ...action.payload.productsStock,
      ];
      state.productsStock.totalCount = action.payload.totalCount;
    },
    [getIncome.fulfilled]: (state, action) => {
      state.income.entity = action.payload.incomes;
      state.income.range = action.payload.dateRange;
      state.income.status = "idle";
    },
    [getIncome.pending]: (state) => {
      state.income.status = "loading";
    },
  },
});
export default slice.reducer;
