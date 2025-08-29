<template>
  <!-- Modal Backdrop -->
  <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    <!-- Background overlay -->
    <transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-20 transition-opacity"
        @click="handleBackdropClick"></div>
    </transition>

    <!-- Modal panel -->
    <transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <div
        v-if="isOpen"
        class="relative z-[10000] w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl transform transition-all"
        :class="sizeClasses"
        @click.stop>
        <!-- Header -->
        <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <slot name="header">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h3>
            </slot>
            <button
              v-if="showCloseButton"
              @click="closeModal"
              class="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 p-1">
              <span class="sr-only">Close</span>
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <slot></slot>
        </div>

        <!-- Footer -->
        <div
          v-if="$slots.footer"
          class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div class="flex justify-end space-x-3">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl", "2xl"].includes(value),
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close", "update:isOpen"]);

const sizeClasses = computed(() => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };
  return sizes[props.size];
});

const closeModal = () => {
  emit("close");
  emit("update:isOpen", false);
};

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    closeModal();
  }
};

// Handle ESC key
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          closeModal();
        }
      };
      document.addEventListener("keydown", handleEscape);

      // Cleanup function
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }
);

// Note: Background content remains visible and scrollable for better UX
</script>
