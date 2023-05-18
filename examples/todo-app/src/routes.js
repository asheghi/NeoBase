export const routes = [
  {
    path: "/",
    component: () => import("./pages/HomePage.vue"),
  },
  {
    path: "/todos",
    component: () => import("./pages/dash/DashboardPage.vue"),
    children: [
      {
        path: "",
        component: () => import("./pages/dash/views/Todos.vue"),
      },
    ],
  },
];
