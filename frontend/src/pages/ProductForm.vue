<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Name -->
    <BaseInput
      v-model="form.name"
      label="Product Name"
      placeholder="Enter product name"
      :error="errors.name"
      required />

    <!-- Code -->
    <BaseInput
      v-model="form.code"
      label="Product Code"
      placeholder="Enter product code (e.g., PRD-001)"
      :error="errors.code"
      required />

    <!-- Category -->
    <BaseSelect
      v-model="form.categoryId"
      label="Category"
      :options="categoryOptions"
      placeholder="Select a category"
      :error="errors.categoryId"
      required />

    <!-- Stock -->
    <BaseInput
      v-model="form.stock"
      type="number"
      label="Stock Quantity"
      placeholder="Enter stock quantity"
      :error="errors.stock"
      required />

    <!-- Price -->
    <BaseInput
      v-model="form.price"
      type="number"
      step="0.01"
      label="Price (IDR)"
      placeholder="Enter price in Rupiah"
      :error="errors.price"
      required />

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3 pt-4">
      <BaseButton type="button" variant="outline" @click="handleCancel"> Cancel </BaseButton>
      <BaseButton type="submit" :loading="loading">
        {{ isEditing ? "Update" : "Create" }} Product
      </BaseButton>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { validateForm, validationRules } from "@/utils/validators";
import BaseInput from "@/components/BaseInput.vue";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseButton from "@/components/BaseButton.vue";

const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["submit", "cancel"]);

const loading = ref(false);
const errors = ref({});

const form = reactive({
  name: "",
  code: "",
  categoryId: "",
  stock: 0,
  price: 0,
});

const isEditing = computed(() => !!props.product);

const categoryOptions = computed(() =>
  props.categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))
);

const validationSchema = {
  name: [
    validationRules.required("Product name is required"),
    validationRules.minLength(2, "Product name must be at least 2 characters"),
    validationRules.maxLength(100, "Product name must not exceed 100 characters"),
  ],
  code: [
    validationRules.required("Product code is required"),
    validationRules.productCode(),
    validationRules.maxLength(50, "Product code must not exceed 50 characters"),
  ],
  categoryId: [validationRules.required("Category is required")],
  stock: [
    validationRules.required("Stock is required"),
    validationRules.integer("Stock must be a whole number"),
    {
      validator: (value) => parseInt(value) >= 0,
      message: "Stock cannot be negative",
    },
  ],
  price: [
    validationRules.required("Price is required"),
    validationRules.positiveNumber("Price must be greater than 0"),
  ],
};

const resetForm = () => {
  form.name = "";
  form.code = "";
  form.categoryId = "";
  form.stock = 0;
  form.price = 0;
  errors.value = {};
};

const populateForm = (product) => {
  if (product) {
    form.name = product.name || "";
    form.code = product.code || "";
    form.categoryId = product.categoryId || product.category?.id || "";
    form.stock = product.stock || 0;
    form.price = product.price || 0;
  }
};

const handleSubmit = async () => {
  // Clear previous errors
  errors.value = {};

  // Validate form
  const validation = validateForm(form, validationSchema);
  if (!validation.isValid) {
    errors.value = Object.fromEntries(
      Object.entries(validation.errors).map(([key, value]) => [key, value[0]])
    );
    return;
  }

  loading.value = true;

  try {
    const productData = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      categoryId: parseInt(form.categoryId),
      stock: parseInt(form.stock),
      price: parseFloat(form.price),
    };

    emit("submit", productData);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  resetForm();
  emit("cancel");
};

// Watch for product changes to populate form
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      populateForm(newProduct);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);
</script>
