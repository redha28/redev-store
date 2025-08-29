<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Products -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CubeIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.totalProducts || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Products in Stock -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-6 w-6 text-green-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">In Stock</dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.inStock || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Out of Stock -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Out of Stock</dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.outOfStock || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <TagIcon class="h-6 w-6 text-blue-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Categories</dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats.totalCategories || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <router-link
            to="/products"
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
            <div class="flex-shrink-0">
              <CubeIcon class="h-6 w-6 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="absolute inset-0" aria-hidden="true" />
              <p class="text-sm font-medium text-gray-900">Manage Products</p>
              <p class="text-sm text-gray-500 truncate">View, edit, and manage your products</p>
            </div>
          </router-link>

          <button
            @click="refreshData"
            class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <div class="flex-shrink-0">
              <ArrowPathIcon class="h-6 w-6 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">Refresh Data</p>
              <p class="text-sm text-gray-500 truncate">Update dashboard statistics</p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Welcome Message -->
    <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <InformationCircleIcon class="h-5 w-5 text-primary-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-primary-800">Welcome to Redev Store!</h3>
          <div class="mt-2 text-sm text-primary-700">
            <p>
              This is your dashboard where you can view an overview of your store. Use the sidebar
              to navigate to different sections of the application.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductsStore } from "@/stores/products";
import {
  CubeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ArrowPathIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";

const productsStore = useProductsStore();

const stats = ref({
  totalProducts: 0,
  inStock: 0,
  outOfStock: 0,
  totalCategories: 0,
});

const loadStats = async () => {
  try {
    await productsStore.fetchProducts();
    const totalFromPagination = productsStore.pagination.total;
    await productsStore.fetchProducts({ limit: totalFromPagination || 1000 });
    await productsStore.fetchCategories();

    const products = productsStore.products;

    stats.value = {
      totalProducts: totalFromPagination,
      inStock: products.filter((p) => p.stock > 0).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
      totalCategories: productsStore.categories.length,
    };
  } catch (error) {
    console.error("Failed to load stats:", error);
  }
};

const refreshData = () => {
  loadStats();
};

onMounted(() => {
  loadStats();
});
</script>
