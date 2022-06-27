export const ApiDocuments = [
  {
    name: "APIs",
    path: "",
    isLarge: true,
    page: () => import("./ApisPage.vue"),
  },
  {
    path: "create",
    name: "create",
    desc: "create new documents",
    page: () => import("./create.md"),
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
  {
    name: "count",
    path: "count",
    desc: "count documents",
    page: () => import("./count.md"),
  },
  {
    path: "update_one",
    name: "update one",
    desc: "update one document",
    page: () => import("./updateOne.md"),
  },
  {
    path: "delete_one",
    name: "delete one",
    desc: "delete one document",
    page: () => import("./deleteOne.md"),
  },
  {
    path: "delete_many",
    name: "delete many",
    desc: "delete many document",
    page: () => import("./deleteMany.md"),
  },
];
