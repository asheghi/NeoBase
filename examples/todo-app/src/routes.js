export const routes = [
  {
    path: "/",
    component: () => import("./pages/HomePage.vue"),
  },
  {
    path: "/dash",
    component: () => import("./pages/dash/DashboardPage.vue"),
    children: [
      {
        path: "",
        component: () => import("./pages/dash/views/Todos.vue"),
      },
    ],
  },
];
