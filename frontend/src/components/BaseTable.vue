<template>
  <div class="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg">
    <!-- Table Header -->
    <div v-if="$slots.header" class="bg-gray-50 px-6 py-3 border-b border-gray-200">
      <slot name="header"></slot>
    </div>

    <!-- Table Content -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              @click="handleSort(column)">
              <div class="flex items-center space-x-1">
                <span>{{ column.title }}</span>
                <div v-if="column.sortable" class="flex flex-col">
                  <svg
                    class="h-3 w-3 -mb-1"
                    :class="getSortIconClass(column.key, 'asc')"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                  </svg>
                  <svg
                    class="h-3 w-3"
                    :class="getSortIconClass(column.key, 'desc')"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-6 py-12 text-center">
              <BaseLoader text="Loading data..." />
            </td>
          </tr>
          <tr v-else-if="!data.length">
            <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
              <div class="flex flex-col items-center">
                <svg
                  class="h-12 w-12 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-2 2.5l-2-2.5m0 0l-2 2.5m2-2.5V21" />
                </svg>
                <p class="text-lg font-medium">{{ emptyText }}</p>
              </div>
            </td>
          </tr>
          <tr
            v-else
            v-for="(item, index) in data"
            :key="getRowKey(item, index)"
            class="hover:bg-gray-50">
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm"
              :class="
                column.align === 'center'
                  ? 'text-center'
                  : column.align === 'right'
                  ? 'text-right'
                  : 'text-left'
              ">
              <slot :name="column.key" :item="item" :value="item[column.key]" :index="index">
                <span
                  v-if="column.render"
                  v-html="column.render(item[column.key], item, index)"></span>
                <span v-else class="text-gray-900">{{ item[column.key] }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer -->
    <div v-if="$slots.footer" class="bg-gray-50 px-6 py-3 border-t border-gray-200">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import BaseLoader from "./BaseLoader.vue";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  sortBy: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: String,
    default: "asc",
    validator: (value) => ["asc", "desc"].includes(value),
  },
  rowKey: {
    type: [String, Function],
    default: "id",
  },
  emptyText: {
    type: String,
    default: "No data found",
  },
});

const emit = defineEmits(["sort"]);

const getRowKey = (item, index) => {
  if (typeof props.rowKey === "function") {
    return props.rowKey(item, index);
  }
  return item[props.rowKey] || index;
};

const handleSort = (column) => {
  if (!column.sortable) return;

  let newOrder = "asc";
  if (props.sortBy === column.key && props.sortOrder === "asc") {
    newOrder = "desc";
  }

  emit("sort", column.key, newOrder);
};

const getSortIconClass = (columnKey, direction) => {
  const isActive = props.sortBy === columnKey && props.sortOrder === direction;
  return isActive ? "text-primary-600" : "text-gray-300";
};
</script>
