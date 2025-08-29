import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast, { POSITION } from "vue-toastification";
import { MotionPlugin } from "@vueuse/motion";
import App from "./App.vue";
import router from "./router";
import "vue-toastification/dist/index.css";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

// Configure toast notifications
const toastOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

// Install plugins
app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);
app.use(MotionPlugin);

// Mount the app
app.mount("#app");
