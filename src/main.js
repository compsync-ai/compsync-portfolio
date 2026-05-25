import { createApp } from "vue";
import { router } from "./router";
import "./style.css";
import App from "./App.vue";

// Disable the browser's native scroll restoration so refresh on the landing
// (and anywhere else without an explicit handler) always starts at the top.
// Routes that want to preserve scroll across refresh (e.g. blog posts) opt
// in explicitly via sessionStorage in their own component.
if (typeof history !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

createApp(App).use(router).mount("#app");
