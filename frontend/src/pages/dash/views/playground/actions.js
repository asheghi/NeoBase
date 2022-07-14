export const document_actions = {
  find: {
    name: "find",
    url: "documents/:project/:collection/find",
    method: "post",
    options: {
      body: {
        type: "json",
        fields: {
          filter: {
            type: "json",
            value: "",
          },
          projection: {
            type: "json",
            optional: true,
            value: "",
          },
          options: {
            type: "json",
            optional: true,
            fields: {
              sort: {
                type: "json",
                value: "",
              },
              skip: {
                type: "integer",
                value: "",
              },
              limit: {
                type: "integer",
                value: "",
              },
            },
          },
        },
      },
    },
  },
};
