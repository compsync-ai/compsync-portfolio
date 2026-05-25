import { createRouter, createWebHistory } from "vue-router";

const HomePage = () => import("../pages/HomePage.vue");
const PreviewDark = () => import("../pages/PreviewDark.vue");
const PreviewLight = () => import("../pages/PreviewLight.vue");
const BlogIndex = () => import("../pages/BlogIndex.vue");
const BlogPost = () => import("../pages/BlogPost.vue");
const NotFoundPage = () => import("../components/NotFoundPage.vue");

export const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/preview/dark", name: "preview-dark", component: PreviewDark, meta: { theme: "dark" } },
    { path: "/preview/light", name: "preview-light", component: PreviewLight, meta: { theme: "light" } },
    { path: "/blog", name: "blog-index", component: BlogIndex },
    { path: "/blog/:slug", name: "blog-post", component: BlogPost, props: true },
    { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundPage }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      return { el: to.hash, behavior: "smooth", top: 80 };
    }
    return { top: 0 };
  }
});

export const sectionRoutes = ["platform", "monitoring", "intelligence", "contact"];

export function jumpToSection(hash) {
  const id = hash.replace("#", "");
  if (!sectionRoutes.includes(id)) return;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
