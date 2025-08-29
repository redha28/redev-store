import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore("ui", () => {
  // State
  const sidebarOpen = ref(false);
  const loading = ref(false);
  const modalOpen = ref(false);
  const modalData = ref(null);

  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  const setSidebarOpen = (isOpen) => {
    sidebarOpen.value = isOpen;
  };

  const setLoading = (isLoading) => {
    loading.value = isLoading;
  };

  const openModal = (data = null) => {
    modalData.value = data;
    modalOpen.value = true;
  };

  const closeModal = () => {
    modalOpen.value = false;
    modalData.value = null;
  };

  return {
    // State
    sidebarOpen,
    loading,
    modalOpen,
    modalData,

    // Actions
    toggleSidebar,
    setSidebarOpen,
    setLoading,
    openModal,
    closeModal,
  };
});
