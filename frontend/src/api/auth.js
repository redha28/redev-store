import api from "./index";

export const authAPI = {
  // Register new user
  register: (data) => api.post("/auth/register", data),

  // Login user
  login: (data) => api.post("/auth/login", data),

  // Get user profile (to check if still authenticated)
  me: () => api.get("/auth/me"),

  // Refresh token
  refresh: () => api.post("/auth/refresh"),

  // Logout user
  logout: () => api.post("/auth/logout"),
};
