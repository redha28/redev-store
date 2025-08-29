import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { productsAPI } from "@/api/products";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useProductsStore = defineStore("products", () => {
  // State
  const products = ref([]);
  const categories = ref([]);
  const loading = ref(false);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const filters = ref({
    search: "",
    sortBy: "id",
    sortOrder: "DESC",
    categoryIds: [],
    inStock: false,
  });

  // Getters
  const totalProducts = computed(() => pagination.value.total);
  const currentPage = computed(() => pagination.value.page);
  const totalPages = computed(() => pagination.value.totalPages);
  const hasProducts = computed(() => products.value.length > 0);

  const fetchProducts = async (params = {}) => {
    loading.value = true;
    try {
      const queryParams = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...filters.value,
        ...params,
      };

      // Remove empty values
      Object.keys(queryParams).forEach((key) => {
        if (
          queryParams[key] === "" ||
          queryParams[key] === null ||
          queryParams[key] === undefined
        ) {
          delete queryParams[key];
        }
      });

      const response = await productsAPI.getProducts(queryParams);
      const { data, meta } = response.data;

      products.value = data;
      pagination.value = {
        page: meta.currentPage,
        limit: pagination.value.limit,
        total: meta.total,
        totalPages: meta.totalPage,
      };

      return response.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      products.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      categories.value = response.data.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      categories.value = [];
    }
  };

  const createProduct = async (productData) => {
    loading.value = true;
    try {
      const response = await productsAPI.createProduct(productData);
      await fetchProducts();
      toast.success("Product created successfully");
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateProduct = async (id, productData) => {
    loading.value = true;
    try {
      const response = await productsAPI.updateProduct(id, productData);
      await fetchProducts();
      toast.success("Product updated successfully");
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteProduct = async (id) => {
    loading.value = true;
    try {
      await productsAPI.deleteProduct(id);
      await fetchProducts();
      toast.success("Product deleted successfully");
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const setPage = (page) => {
    pagination.value.page = page;
  };

  const setLimit = (limit) => {
    pagination.value.limit = limit;
    pagination.value.page = 1;
  };

  const setSearch = (search) => {
    filters.value.search = search;
    pagination.value.page = 1;
  };

  const setSorting = (sortBy, sortOrder) => {
    filters.value.sortBy = sortBy;
    filters.value.sortOrder = sortOrder;
    pagination.value.page = 1;
  };

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters };
    pagination.value.page = 1;
  };

  const resetFilters = () => {
    filters.value = {
      search: "",
      sortBy: "id",
      sortOrder: "DESC",
      categoryIds: [],
      inStock: false,
    };
    pagination.value.page = 1;
  };

  return {
    // State
    products,
    categories,
    loading,
    pagination,
    filters,

    // Getters
    totalProducts,
    currentPage,
    totalPages,
    hasProducts,

    // Actions
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    setPage,
    setLimit,
    setSearch,
    setSorting,
    setFilters,
    resetFilters,
  };
});
