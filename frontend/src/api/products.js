import api from "./index";

export const productsAPI = {
  // Get products list with filters and pagination
  getProducts: (params = {}) => {
    return api.get("/products", { params });
  },

  // Get product by ID
  getProduct: (id) => api.get(`/products/${id}`),

  // Create new product
  createProduct: (data) => api.post("/products", data),

  // Update product
  updateProduct: (id, data) => api.patch(`/products/${id}`, data),

  // Delete product
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Get categories (if available)
  getCategories: () => api.get("/product-categories"),
};
