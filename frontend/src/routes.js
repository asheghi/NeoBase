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
        component: () => import("./pages/dash/views/Projects.vue"),
      },
      {
        name: "project",
        path: ":project",
        component: () => import("./pages/dash/views/Project.vue"),
        children: [
          {
            name: "collections",
            path: "data",
            component: () => import("./pages/dash/views/data/Collections.vue"),
            children: [
              {
                name: "documents",
                path: ":collection",
                component: () =>
                  import("./pages/dash/views/data/Documents.vue"),
                children: [
                  {
                    name: "document",
                    path: ":_id",
                    component: () =>
                      import("./pages/dash/views/data/ViewEditDocument.vue"),
                  },
                ],
              },
            ],
          },
          {
            name: "auth",
            path: "auth",
            component: () => import("./pages/dash/views/auth/Users.vue"),
            children: [
              {
                name: "user",
                path: ":uid",
                component: () => import("./pages/dash/views/auth/User.vue"),
              },
            ],
          },
          {
            name: "access",
            path: "access",
            component: () =>
              import("./pages/dash/views/access/CollectionsAccessControl.vue"),
            children: [
              {
                name: "access-config",
                path: ":collection",
                component: () =>
                  import("./pages/dash/views/access/AccessConfig.vue"),
              },
            ],
          },
        ],
      },
    ],
  },
];
