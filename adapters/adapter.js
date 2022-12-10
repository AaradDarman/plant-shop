import http from "./xhr";

const createProduct = (product) => {
  return http.post(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/product/create`,
    product
  );
};

const getCategories = () => {
  return http.get(`${process.env.NEXT_PUBLIC_SERVICE_URL}/category/get-all`);
};

const getInitialIntel = () => {
  return http.get(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/products/initial-intel`
  );
};

const getProducts = (query) => {
  return http.get(`${process.env.NEXT_PUBLIC_SERVICE_URL}/products`, {
    params: query,
  });
};

const getProductsIds = () => {
  return http.get(`${process.env.NEXT_PUBLIC_SERVICE_URL}/products/ids`);
};

const getProductsByCategory = (category, query) => {
  let encodedUrl = encodeURI(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/products/${category}`
  );
  return http.get(encodedUrl, {
    params: query,
  });
};

const getProduct = (id) => {
  return http.get(`${process.env.NEXT_PUBLIC_SERVICE_URL}/product/${id}`);
};

const updateProductViewCount = (id) => {
  return http.post(`${process.env.NEXT_PUBLIC_SERVICE_URL}/product/${id}`);
};

const deleteProduct = (id) => {
  return http.delete(`${process.env.NEXT_PUBLIC_SERVICE_URL}/product/${id}`);
};

const editProduct = (updatedProduct) => {
  return http.put(
    `${process.env.NEXT_PUBLIC_SERVICE_URL}/product/edit/${updatedProduct._id}`,
    {
      product: updatedProduct,
    }
  );
};

const getBasket = (userId) => {
  return http.get(`${process.env.NEXT_PUBLIC_SERVICE_URL}/basket/${userId}`);
};

// eslint-disable-next-line
export default {
  createProduct,
  getProducts,
  getProductsByCategory,
  getProduct,
  updateProductViewCount,
  deleteProduct,
  editProduct,
  getBasket,
  getCategories,
  getInitialIntel,
  getProductsIds,
};
