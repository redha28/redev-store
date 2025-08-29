<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="flex h-16 items-center justify-between px-6">
      <!-- Left side - Title -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Redev Store</h1>
      </div>

      <!-- Right side - User info -->
      <div class="flex items-center space-x-4">
        <!-- User profile -->
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span class="text-sm font-medium text-white">
                {{ userInitials }}
              </span>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="text-sm font-medium text-gray-900">
              {{ userName }}
            </div>
            <div class="text-xs text-gray-500">Administrator</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const userName = computed(() => authStore.userName);

const userInitials = computed(() => {
  const name = userName.value;
  if (!name) return "A";

  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});
</script>
