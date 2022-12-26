export const routes = [
  {
    path: "/",
    component: () => import("./pages/HomePage.vue"),
  },
  {
    path: "/login",
    component: () => import("./pages/auth/LoginPage.vue"),
  },
  {
    path: "/register",
    component: () => import("./pages/auth/RegisterPage.vue"),
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
