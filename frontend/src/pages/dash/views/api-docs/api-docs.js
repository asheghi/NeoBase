export const ApiDocs = [
  {
    name: "Documents",
    children: [
      {
        name: "Create",
        desc: "create a new document in the collection",
        path: "/documents/:project/:collection",
        method: "post",
      },
      {
        name: "FindOne",
        desc: "find a document in the collection",
        path: "/documents/:project/:collection",
        method: "post",
        body: {
          filter: {
            type: Object,
          },
          projection: {
            type: Object,
          },
          options: {
            sort: {
              type: String,
              default: "",
            },
            limit: {
              type: Number,
              default: 0,
              desc: "used for pagination,",
            },
            skip: {
              type: Number,
              default: 0,
              desc: "used for pagination,",
            },
          },
        },
      },
    ],
  },
];
