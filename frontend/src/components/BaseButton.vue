<template>
  <button :class="buttonClasses" :disabled="disabled || loading" @click="handleClick">
    <div v-if="loading" class="flex items-center">
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ loadingText || "Loading..." }}
    </div>
    <slot v-else></slot>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "danger", "success", "warning", "outline"].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: "",
  },
  block: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const buttonClasses = computed(() => {
  let classes = ["btn"];

  // Variant classes
  switch (props.variant) {
    case "primary":
      classes.push("btn-primary");
      break;
    case "secondary":
      classes.push("btn-secondary");
      break;
    case "danger":
      classes.push("btn-danger");
      break;
    // Add other variants as needed
    default:
      classes.push("btn-primary");
  }

  // Size classes
  if (props.size === "lg") {
    classes.push("btn-lg");
  }

  // Block class
  if (props.block) {
    classes.push("btn-block");
  }

  return classes.join(" ");
});

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>
