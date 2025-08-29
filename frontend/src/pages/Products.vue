<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Products</h1>
      <BaseButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-4 w-4 mr-2" />
        Add Product
      </BaseButton>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <!-- Search -->
        <BaseInput
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          @input="debouncedSearch">
          <template #icon>
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </template>
        </BaseInput>

        <!-- Category Filter -->
        <BaseSelect
          v-model="filters.categoryIds"
          :options="categoryOptions"
          placeholder="All Categories"
          @change="applyFilters" />

        <!-- Sort By -->
        <BaseSelect v-model="sortBy" :options="sortOptions" @change="applySorting" />

        <!-- Sort Order -->
        <BaseSelect v-model="sortOrder" :options="sortOrderOptions" @change="applySorting" />
      </div>

      <div class="mt-4 flex items-center justify-between">
        <!-- In Stock Filter -->
        <label class="flex items-center">
          <input
            v-model="filters.inStock"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            @change="applyFilters" />
          <span class="ml-2 text-sm text-gray-600">Only in stock</span>
        </label>

        <!-- Reset Filters -->
        <BaseButton variant="outline" size="sm" @click="resetFilters"> Reset Filters </BaseButton>
      </div>
    </div>

    <!-- Products Table -->
    <BaseTable
      :columns="columns"
      :data="products"
      :loading="loading"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      empty-text="No products found"
      @sort="handleSort">
      <template #id="{ value }">
        <span class="font-mono text-sm">#{{ value }}</span>
      </template>

      <template #name="{ value }">
        <span class="font-medium text-gray-900">{{ value }}</span>
      </template>

      <template #code="{ value }">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {{ value }}
        </span>
      </template>

      <template #category="{ item }">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ item.category?.name || "N/A" }}
        </span>
      </template>

      <template #stock="{ value }">
        <span
          :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            value > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
          ]">
          {{ formatNumber(value) }}
        </span>
      </template>

      <template #price="{ value }">
        <span class="font-medium text-gray-900">{{ formatCurrency(value) }}</span>
      </template>

      <template #createdAt="{ value }">
        <span class="text-sm text-gray-500">{{ formatDate(value) }}</span>
      </template>

      <template #updatedAt="{ value }">
        <span class="text-sm text-gray-500">{{ formatDate(value) }}</span>
      </template>

      <template #actions="{ item }">
        <div class="flex space-x-2">
          <BaseButton size="sm" variant="outline" @click="openEditModal(item)">
            <PencilIcon class="h-4 w-4" />
          </BaseButton>
          <BaseButton
            size="sm"
            variant="danger"
            :disabled="item.stock > 0"
            :title="item.stock > 0 ? 'Cannot delete product with stock > 0' : 'Delete product'"
            @click="confirmDelete(item)">
            <TrashIcon class="h-4 w-4" />
          </BaseButton>
        </div>
      </template>
    </BaseTable>

    <!-- Pagination -->
    <BasePagination
      :current-page="pagination.page"
      :total-pages="pagination.totalPages"
      :total="pagination.total"
      :limit="pagination.limit"
      @page-change="handlePageChange"
      @limit-change="handleLimitChange" />

    <!-- Product Form Modal -->
    <BaseModal v-model:is-open="showModal" :title="modalTitle" size="lg" @close="closeModal">
      <ProductForm
        :product="selectedProduct"
        :categories="categories"
        @submit="handleFormSubmit"
        @cancel="closeModal" />
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-model:is-open="showDeleteModal"
      title="Delete Product"
      size="md"
      @close="closeDeleteModal">
      <div class="space-y-4">
        <p class="text-sm text-gray-500">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div v-if="productToDelete" class="bg-gray-50 p-3 rounded-md">
          <p class="text-sm font-medium text-gray-900">{{ productToDelete.name }}</p>
          <p class="text-sm text-gray-500">Code: {{ productToDelete.code }}</p>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="outline" @click="closeDeleteModal"> Cancel </BaseButton>
        <BaseButton variant="danger" :loading="loading" @click="handleDelete"> Delete </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useProductsStore } from "@/stores/products";
import { formatCurrency, formatNumber, formatDate } from "@/utils/format";
import { debounce } from "@/utils/helpers";
import BaseTable from "@/components/BaseTable.vue";
import BasePagination from "@/components/BasePagination.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseModal from "@/components/BaseModal.vue";
import ProductForm from "./ProductForm.vue";
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";

const productsStore = useProductsStore();

// Reactive state
const searchQuery = ref("");
const showModal = ref(false);
const showDeleteModal = ref(false);
const selectedProduct = ref(null);
const productToDelete = ref(null);

// Computed properties
const products = computed(() => productsStore.products);
const categories = computed(() => productsStore.categories);
const loading = computed(() => productsStore.loading);
const pagination = computed(() => productsStore.pagination);
const filters = computed(() => productsStore.filters);
const sortBy = ref(productsStore.filters.sortBy);
const sortOrder = ref(productsStore.filters.sortOrder);

const modalTitle = computed(() => {
  return selectedProduct.value ? "Edit Product" : "Add Product";
});

const categoryOptions = computed(() => [
  { value: "", label: "All Categories" },
  ...categories.value.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })),
]);

// Table columns
const columns = [
  { key: "id", title: "ID", sortable: true },
  { key: "name", title: "Name", sortable: true },
  { key: "code", title: "Code", sortable: true },
  { key: "category", title: "Category", sortable: false },
  { key: "stock", title: "Stock", sortable: true },
  { key: "price", title: "Price", sortable: true },
  { key: "createdAt", title: "Created", sortable: true },
  { key: "updatedAt", title: "Updated", sortable: true },
  { key: "actions", title: "Actions", sortable: false, align: "center" },
];

// Sort options
const sortOptions = [
  { value: "id", label: "ID" },
  { value: "name", label: "Name" },
  { value: "code", label: "Code" },
  { value: "price", label: "Price" },
  { value: "stock", label: "Stock" },
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
];

const sortOrderOptions = [
  { value: "ASC", label: "Ascending" },
  { value: "DESC", label: "Descending" },
];

// Methods
const fetchProducts = async () => {
  await productsStore.fetchProducts();
};

const fetchCategories = async () => {
  await productsStore.fetchCategories();
};

const debouncedSearch = debounce(() => {
  productsStore.setSearch(searchQuery.value);
  fetchProducts();
}, 500);

const applyFilters = () => {
  fetchProducts();
};

const applySorting = () => {
  productsStore.setSorting(sortBy.value, sortOrder.value);
  fetchProducts();
};

const resetFilters = () => {
  searchQuery.value = "";
  sortBy.value = "id";
  sortOrder.value = "DESC";
  productsStore.resetFilters();
  fetchProducts();
};

const handleSort = (column, order) => {
  sortBy.value = column;
  sortOrder.value = order;
  applySorting();
};

const handlePageChange = (page) => {
  productsStore.setPage(page);
  fetchProducts();
};

const handleLimitChange = (limit) => {
  productsStore.setLimit(limit);
  fetchProducts();
};

const openCreateModal = () => {
  selectedProduct.value = null;
  showModal.value = true;
};

const openEditModal = (product) => {
  selectedProduct.value = { ...product };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProduct.value = null;
};

const handleFormSubmit = async (productData) => {
  try {
    if (selectedProduct.value) {
      await productsStore.updateProduct(selectedProduct.value.id, productData);
    } else {
      await productsStore.createProduct(productData);
    }
    closeModal();
  } catch (error) {
    console.error("Product form error:", error);
  }
};

const confirmDelete = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  productToDelete.value = null;
};

const handleDelete = async () => {
  if (!productToDelete.value) return;

  try {
    await productsStore.deleteProduct(productToDelete.value.id);
    closeDeleteModal();
  } catch (error) {
    console.error("Delete product error:", error);
  }
};

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCategories()]);
});

// Watch for filter changes
watch(() => filters.value.categoryIds, applyFilters);
watch(() => filters.value.inStock, applyFilters);
</script>
