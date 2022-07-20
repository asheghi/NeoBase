function getClient(project, {baseurl} = {},getToken) {
  if (!project) throw new Error('project must be defined.')
  const axios = require('axios');
  let ax = axios.create({
    baseURL: baseurl,
  });

  // set user token
  ax.interceptors.request.use((config) => {
    try {
      if (getToken && !config.dontSetToken) config.headers["x-auth-token"] = getToken();
    } catch (e) {
      console.error(e);
    }
    return config;
  });

  return {
    Collection(collection) {
      if (!collection) throw new Error('collection must be defined.')

      return {
        //with exec
        find(filter, projection, options = {}) {
          const body = {};
          if (filter) {
            body.filter = filter;
          }
          if (projection) {
            body.projection = projection;
          }
          const {sort, skip, limit} = options;
          if (sort || skip || limit) {
            body.options = {};
          }
          if (sort) {
            body.options.sort = sort;
          }
          if (limit) {
            body.options.sort = limit;
          }
          if (skip) {
            body.options.skip = skip
          }
          const exec = async () => ax.post(`documents/${project}/${collection}/find`, body)
          return {
            populate(arg) {
              if (!body.populate) body.populate = [];
              body.populate.push(arg)
              return this;
            },
            limit(arg) {
              if (!body.options) {
                body.options = {};
              }
              body.options.limit = arg;
              return this;
            },
            skip(arg) {
              if (!body.options) {
                body.options = {};
              }
              body.options.skip = arg;
              return this;
            },
            sort(arg) {
              if (!body.options) {
                body.options = {};
              }
              body.options.sort = arg;
              return this;
            },
            projection(arg) {
              body.projection = arg;
              return this;
            },
            exec
          }
        },
        findOne(filter, projection) {
          const body = {};
          if (filter) {
            body.filter = filter;
          }
          if (projection) {
            body.projection = projection;
          }

          const exec = async () => ax.post(`documents/${project}/${collection}/findOne`, body)
          return {
            populate(arg) {
              if (!body.populate) body.populate = [];
              body.populate.push(arg)
              return this;
            },
            projection(arg) {
              body.projection = arg;
              return this;
            },
            exec
          }
        },
        //no exec
        count(filter) {
          const body = {};
          if (filter) {
            body.filter = filter;
          }
          return ax.post(`documents/${project}/${collection}/count`, body)
        },
        create: async (document) => ax.post(`documents/${project}/${collection}/findOne`, document),
        deleteOne: (payload) => ax.post(`documents/${project}/${collection}/deleteOne`, payload),
        updateOne: (filter, update) => ax.post(`documents/${project}/${collection}/updateOne`, {filter, update}),
        deleteMany: (filter) => ax.post(`documents/${project}/${collection}/deleteOne`, filter),
      }
    },
    Auth:{
      login: (payload) => ax.post(`auth/${project}/login`, payload),
      register: (payload) => ax.post(`auth/${project}/register`, payload),
      me: (token) => ax.get(`auth/${project}/me`,{headers:{'x-auth-token' : token, dontSetToken: true}}),
    },
    axiosClient: ax,
    setAxiosClient:(arg) => ax = arg,
  }
}

module.exports = getClient;
