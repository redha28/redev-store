<template>
  <div
    class="flex items-center justify-between bg-white px-4 py-3 sm:px-6"
    :class="{ 'border-t border-gray-200': !noBorder }">
    <!-- Left side - Info -->
    <div class="flex flex-1 justify-between sm:hidden">
      <BaseButton
        :disabled="currentPage <= 1"
        variant="outline"
        size="sm"
        @click="goToPage(currentPage - 1)">
        Previous
      </BaseButton>
      <BaseButton
        :disabled="currentPage >= totalPages"
        variant="outline"
        size="sm"
        @click="goToPage(currentPage + 1)">
        Next
      </BaseButton>
    </div>

    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ startItem }}</span>
          to
          <span class="font-medium">{{ endItem }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          results
        </p>
      </div>

      <!-- Pagination controls -->
      <div class="flex items-center space-x-2">
        <!-- Limit selector -->
        <div class="flex items-center space-x-2">
          <label for="limit" class="text-sm text-gray-700">Per page:</label>
          <select
            id="limit"
            :value="limit"
            @change="changeLimit($event.target.value)"
            class="rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500">
            <option v-for="option in limitOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <!-- Page navigation -->
        <nav
          class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination">
          <!-- Previous button -->
          <button
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
            class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Page numbers -->
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center border px-4 py-2 text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              ]">
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
              ...
            </span>
          </template>

          <!-- Next button -->
          <button
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
            class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  limitOptions: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  noBorder: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["page-change", "limit-change"]);

const startItem = computed(() => {
  if (props.total === 0) return 0;
  return (props.currentPage - 1) * props.limit + 1;
});

const endItem = computed(() => {
  const end = props.currentPage * props.limit;
  return end > props.total ? props.total : end;
});

const visiblePages = computed(() => {
  const delta = 2; // Number of pages to show on each side of current page
  const range = [];
  const rangeWithDots = [];

  for (
    let i = Math.max(2, props.currentPage - delta);
    i <= Math.min(props.totalPages - 1, props.currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (props.currentPage - delta > 2) {
    rangeWithDots.push(1, "...");
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (props.currentPage + delta < props.totalPages - 1) {
    rangeWithDots.push("...", props.totalPages);
  } else if (props.totalPages > 1) {
    rangeWithDots.push(props.totalPages);
  }

  return rangeWithDots;
});

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("page-change", page);
  }
};

const changeLimit = (newLimit) => {
  emit("limit-change", parseInt(newLimit));
};
</script>
