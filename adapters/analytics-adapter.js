import http from "./xhr";

const getRecentOrders = (search, sortBy, desc) => {
  return http.get(`/api/order/get`, {
    params: { search, sortBy, desc },
  });
};

const getProductsStock = (search, sortBy, desc, skip = 0) => {
  return http.get(`/api/products/stock`, {
    params: { search, sortBy, desc, skip },
  });
};

const getIncome = (range) => {
  return http.get(`/api/products/income`, {
    params: { range },
  });
};

const getOrder = (id) => {
  return http.get(`/api/order/get/${id}`);
};

// eslint-disable-next-line
export default {
  getRecentOrders,
  getProductsStock,
  getIncome,
  getOrder,
};
