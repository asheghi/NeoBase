function getClient(project, {baseurl} = {}) {
  if (!project) throw new Error('project must be defined.')
  const axios = require('axios');
  const ax = axios.create({
    baseURL: baseurl,
  })
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
        count(filter) {
          const body = {};
          if (filter) {
            body.filter = filter;
          }
          const exec = async () => ax.post(`documents/${project}/${collection}/count`, body)
          return {
            exec
          }
        },
        //no exec
        create: async (document) => ax.post(`documents/${project}/${collection}/findOne`, document),
        deleteOne: (payload) => ax.post(`documents/${project}/${collection}/deleteOne`, payload),
        updateOne: (filter, update) => ax.post(`documents/${project}/${collection}/updateOne`, {filter, update}),
        deleteMany: (filter) => ax.post(`documents/${project}/${collection}/deleteOne`, filter),
      }
    }
  }
}

module.exports = getClient;
