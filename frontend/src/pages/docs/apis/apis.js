export const ApiDocuments = [
  {
    name: "APIs",
    path: "",
    isLarge: true,
    page: () => import("./ApisPage.vue"),
  },
  {
    name: "find",
    path: "find",
    desc: "fetch documents",
    page: () => import("./find.md"),
  },
  {
    path: "find_one",
    name: "find one",
    desc: "fetch documents",
    page: () => import("./find_one.md"),
  },
];
