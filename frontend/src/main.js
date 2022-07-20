import "./index.css";
import "sweetalert2/dist/sweetalert2.css";

import { createApp } from "vue";
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import App from "./App.vue";
import { routes } from "./routes.js";

const mode = import.meta.env.VITE_ROUTER_HISTORY_MODE || "hash";
const history = mode === "hash" ? createWebHashHistory() : createWebHistory();
const router = createRouter({
  history,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    return {
      top: 0,
    };
  },
});

let app = createApp(App);
app.use(router);
app.mount("#app");
