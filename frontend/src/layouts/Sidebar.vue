<template>
  <div
    class="fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out"
    :class="sidebarClasses"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <!-- Sidebar background -->
    <div class="flex h-full flex-col bg-sidebar-bg shadow-lg">
      <!-- Logo/Brand -->
      <div class="flex h-16 items-center justify-center border-b border-gray-700 px-4">
        <transition
          enter-active-class="transition-opacity duration-300"
          leave-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <h1 v-if="isExpanded" class="text-lg font-bold text-white">Redev Store</h1>
          <div v-else class="text-lg font-bold text-white">RS</div>
        </transition>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-4 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
          :class="[
            $route.name === item.name
              ? 'bg-sidebar-hover text-white'
              : 'text-gray-300 hover:bg-sidebar-hover hover:text-white',
          ]">
          <component
            :is="item.icon"
            class="flex-shrink-0 h-5 w-5"
            :class="isExpanded ? 'mr-3' : ''" />
          <transition
            enter-active-class="transition-opacity duration-300"
            leave-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <span v-if="isExpanded">{{ item.label }}</span>
          </transition>
        </router-link>
      </nav>

      <!-- Logout -->
      <div class="border-t border-gray-700 p-4">
        <button
          @click="handleLogout"
          class="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-sidebar-hover hover:text-white transition-colors duration-200">
          <ArrowRightOnRectangleIcon
            class="flex-shrink-0 h-5 w-5"
            :class="isExpanded ? 'mr-3' : ''" />
          <transition
            enter-active-class="transition-opacity duration-300"
            leave-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <span v-if="isExpanded">Logout</span>
          </transition>
        </button>
      </div>
    </div>
  </div>

  <!-- Logout Confirmation Modal -->
  <BaseModal
    v-model:is-open="showLogoutModal"
    title="Confirm Logout"
    size="md"
    @close="cancelLogout">
    <div class="space-y-4">
      <p class="text-sm text-gray-500">
        Are you sure you want to logout? You will need to login again to access the application.
      </p>
    </div>

    <template #footer>
      <BaseButton variant="outline" @click="cancelLogout"> Cancel </BaseButton>
      <BaseButton variant="danger" :loading="authStore.loading" @click="confirmLogout">
        Logout
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import BaseModal from "@/components/BaseModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import { HomeIcon, CubeIcon, ArrowRightOnRectangleIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();

const isExpanded = ref(false);
const showLogoutModal = ref(false);

const menuItems = [
  {
    name: "Dashboard",
    label: "Dashboard",
    to: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Products",
    label: "Products",
    to: "/products",
    icon: CubeIcon,
  },
];

const sidebarClasses = computed(() => {
  return isExpanded.value ? "w-64" : "w-16";
});

const handleMouseEnter = () => {
  isExpanded.value = true;
};

const handleMouseLeave = () => {
  isExpanded.value = false;
};

const handleLogout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = async () => {
  try {
    await authStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    showLogoutModal.value = false;
  }
};

const cancelLogout = () => {
  showLogoutModal.value = false;
};
</script>
