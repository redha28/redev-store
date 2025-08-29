<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :class="selectClasses"
      @change="handleChange">
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)">
        {{ getOptionLabel(option) }}
      </option>
    </select>

    <!-- Error message -->
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <!-- Help text -->
    <p v-if="help && !error" class="text-sm text-gray-500">{{ help }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { generateId } from "@/utils/format";

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    required: true,
  },
  optionValue: {
    type: String,
    default: "value",
  },
  optionLabel: {
    type: String,
    default: "label",
  },
  error: {
    type: String,
    default: "",
  },
  help: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const id = computed(() => `select-${generateId()}`);

const selectClasses = computed(() => {
  const baseClasses =
    "block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-50";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const errorClasses = props.error
    ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
    : "";

  return [baseClasses, sizeClasses[props.size], errorClasses].filter(Boolean).join(" ");
});

const getOptionValue = (option) => {
  if (typeof option === "object" && option !== null) {
    return option[props.optionValue];
  }
  return option;
};

const getOptionLabel = (option) => {
  if (typeof option === "object" && option !== null) {
    return option[props.optionLabel];
  }
  return option;
};

const handleChange = (event) => {
  const value = event.target.value;
  emit("update:modelValue", value);
  emit("change", value);
};
</script>
