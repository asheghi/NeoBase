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
  findOne: {
    name: "findOne",
    url: "documents/:project/:collection/findOne",
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
        },
      },
    },
  },
  count: {
    name: "count",
    url: "documents/:project/:collection/count",
    method: "post",
    options: {
      body: {
        type: "json",
        fields: {
          filter: {
            type: "json",
            value: "",
          },
        },
      },
    },
  },
  create: {
    name: "create",
    url: "documents/:project/:collection/create",
    method: "post",
    options: {
      body: {
        type: "json",
        value: "",
      },
    },
  },
  updateOne: {
    name: "updateOne",
    url: "documents/:project/:collection/updateOne",
    method: "post",
    options: {
      body: {
        type: "json",
        fields: {
          filter: {
            type: "json",
            value: "",
          },
          update: {
            type: "json",
            value: "",
          },
        },
      },
    },
  },
  deleteOne: {
    name: "deleteOne",
    url: "documents/:project/:collection/deleteOne",
    method: "post",
    options: {
      body: {
        type: "json",
      },
    },
  },
  deleteMany: {
    name: "deleteMany",
    url: "documents/:project/:collection/deleteMany",
    method: "post",
    options: {
      body: {
        type: "json",
      },
    },
  },
  register: {
    name: "register",
    url: "auth/:project/register",
    method: "post",
    hideAuthToken: true,
    options: {
      body: {
        type: "json",
        fields: {
          email: {
            type: "string",
            value: "",
          },
          password: {
            type: "string",
            value: "",
          },
        },
      },
    },
  },
  login: {
    name: "login",
    url: "auth/:project/login",
    method: "post",
    hideAuthToken: true,
    options: {
      body: {
        type: "json",
        fields: {
          email: {
            type: "string",
            value: "",
          },
          password: {
            type: "string",
            value: "",
          },
        },
      },
    },
  },
  me: {
    name: "me",
    url: "auth/:project/me",
    method: "get",
    options: {},
  },
};
