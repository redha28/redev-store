import axios from "axios";
import { getCookie, removeCookie } from "@/utils/cookie";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Enable cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // No need to add Authorization header, cookies are sent automatically
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;

    if (response?.status === 401) {
      const message = response.data?.message;

      // Check if this is a login error (invalid credentials)
      if (message === "Invalid credentials" || message?.includes("Invalid")) {
        toast.error(message || "Invalid credentials");
      } else {
        // Token expired or session invalid - clear user data and redirect
        removeCookie("user");

        // Redirect to login
        const router = useRouter();
        await router.push("/login");

        toast.error("Session expired. Please login again.");
      }
    } else if (response?.status === 400) {
      // Validation errors - handle both string and array messages
      const message = response.data?.message;
      if (Array.isArray(message)) {
        // If message is an array, show each error
        message.forEach((msg) => toast.error(msg));
      } else {
        // If message is a string, show it directly
        toast.error(message || "Validation error");
      }
    } else if (response?.status === 404) {
      toast.error("Data not found");
    } else if (response?.status === 409) {
      const message = response.data?.message;
      if (Array.isArray(message)) {
        message.forEach((msg) => toast.error(msg));
      } else {
        toast.error(message || "Conflict error");
      }
    } else if (response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;
