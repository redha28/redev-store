import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authAPI } from "@/api/auth";
import { setCookie, getCookie, removeCookie } from "@/utils/cookie";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const loading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const userName = computed(() => user.value?.name || "Admin");

  // Actions
  const initAuth = () => {
    const savedUser = getCookie("user");

    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        removeCookie("user");
      }
    }
  };

  const login = async (credentials) => {
    loading.value = true;
    try {
      const response = await authAPI.login(credentials);
      const { user: userData } = response.data;

      user.value = userData;
      setCookie("user", JSON.stringify(userData), 7);

      toast.success("Login successful");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw error;
      } else {
        toast.error("Login failed. Please try again.");
        throw error;
      }
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    try {
      const response = await authAPI.register(userData);
      toast.success("Registration successful. Please login.");
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      if (user.value) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      user.value = null;
      removeCookie("user");
      loading.value = false;
      toast.success("Logged out successfully");
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refresh();
      return response.data;
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const checkAuth = async () => {
    try {
      const response = await authAPI.me();
      const userData = response.data.data;

      user.value = userData;
      setCookie("user", JSON.stringify(userData), 7);

      return userData;
    } catch (error) {
      user.value = null;
      removeCookie("user");
      throw error;
    }
  };

  return {
    user,
    loading,

    isAuthenticated,
    userName,

    initAuth,
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
  };
});
