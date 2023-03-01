import { Docs } from "./pages/docs/docs";

export const routes = [
  {
    path: "/",
    component: () => import("./pages/index/HomePage.vue"),
  },
  {
    path: "/docs",
    name: "docs",
    component: () => import("./pages/docs/DocumentsPage.vue"),
    children: [
      ...Docs.filter((it) => it.page).map((it) => ({
        path: it.path,
        component: it.page,
        name: "docs-" + it.path,
        meta: {
          level: it.level,
          hideToC: it.hideToC,
        },
      })),
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("./pages/404/PageNotFound.vue"),
  },
];

export const sideBarItems = [...Docs];
