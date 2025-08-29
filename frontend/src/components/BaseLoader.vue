<template>
  <div class="flex items-center justify-center" :class="containerClasses">
    <div
      class="animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
      :class="sizeClasses"></div>
    <span v-if="text" class="ml-2 text-sm font-medium">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
  text: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "white", "gray"].includes(value),
  },
  overlay: {
    type: Boolean,
    default: false,
  },
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };
  return sizes[props.size];
});

const containerClasses = computed(() => {
  const colors = {
    primary: "text-primary-600",
    white: "text-white",
    gray: "text-gray-600",
  };

  const baseClasses = colors[props.color];
  const overlayClasses = props.overlay ? "fixed inset-0 bg-black bg-opacity-50 z-50" : "";

  return [baseClasses, overlayClasses].filter(Boolean).join(" ");
});
</script>
