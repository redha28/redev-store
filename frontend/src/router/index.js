import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Lazy load components
const Login = () => import("@/pages/Login.vue");
const Register = () => import("@/pages/Register.vue");
const Products = () => import("@/pages/Products.vue");
const Dashboard = () => import("@/pages/Dashboard.vue");
const DefaultLayout = () => import("@/layouts/DefaultLayout.vue");

const routes = [
  {
    path: "/",
    redirect: "/products",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresAuth: false,
      guest: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      requiresAuth: false,
      guest: true,
    },
  },
  {
    path: "/",
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: {
          title: "Dashboard",
        },
      },
      {
        path: "products",
        name: "Products",
        component: Products,
        meta: {
          title: "Products",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/products",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  authStore.initAuth();

  const requiresAuth = to.meta.requiresAuth;
  const isGuest = to.meta.guest;

  if (requiresAuth) {
    try {
      await authStore.checkAuth();
      next();
    } catch (error) {
      next("/login");
    }
  } else if (isGuest && authStore.isAuthenticated) {
    try {
      await authStore.checkAuth();
      next("/products");
    } catch (error) {
      next();
    }
  } else {
    next();
  }
});

// Set page title
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Redev Store`;
  } else {
    document.title = "Redev Store";
  }
});

export default router;
