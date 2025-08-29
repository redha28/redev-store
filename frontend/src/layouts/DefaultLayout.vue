<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <div class="transition-all duration-300 ease-in-out" :class="mainContentClasses">
      <!-- Header -->
      <Header />

      <!-- Page content -->
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";

// Adjust main content margin based on sidebar width
// Since sidebar is fixed, we need to add margin to avoid overlap
const mainContentClasses = computed(() => {
  // Default margin for collapsed sidebar (w-16)
  return "ml-16";
});
</script>
