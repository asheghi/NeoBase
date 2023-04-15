// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { createDeferred } from './lib/defferable'

type QueryOptions = {
  sort?: any
  skip?: number
  limit?: number
}
export type ClientOptions = {
}

function createClient(baseUrl) {
  baseUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/');
  const apiBaseUrl = baseUrl + "api";

  let ax = axios.create({
    baseURL: apiBaseUrl,
    // we are using cookie for authentication!
    withCredentials: true,
  })

  return {
    Admin: {
      Collection: {
        getListOfCollections: () => ax.get(`data/collections`),
        createCollection: (name) => ax.post('data/collections', { name }),
        deleteCollection: (name) => ax.delete('data/collection/' + name),
      },
      Users: {
        find() {
          return ax.get(`user/manage`);
        },
        newUser(payload) {
          return ax.post("user/manage", payload);
        },
        deleteUser(uid) {
          return ax.delete(`user/manage/${uid}`);
        },
        fetchUser(uid) {
          return ax.get(`user/manage/${uid}`);
        },
        updateUser(uid, payload) {
          return ax.put(`user/manage/${uid}`, payload);
        },
      },
    },
    Collection(collection: string) {
      if (!collection) throw new Error('collection must be defined.')

      return {
        find(filter?: {}, projection?: any, options: QueryOptions = {}) {
          const body: any = {}
          if (filter) {
            body.filter = filter
          }
          if (projection) {
            body.projection = projection
          }
          const { sort, skip, limit } = options
          if (sort || skip || limit) {
            body.options = {}
          }
          if (sort) {
            body.options.sort = sort
          }
          if (limit) {
            body.options.sort = limit
          }
          if (skip) {
            body.options.skip = skip
          }

          const deferred = createDeferred<AxiosResponse>()

          const exec = () =>
            ax
              .post(`data/documents/${collection}/find`, body)
              .then(deferred.resolve, deferred.reject)

          return {
            populate(arg) {
              if (!body.populate) body.populate = []
              body.populate.push(arg)
              return this
            },
            limit(arg) {
              if (!body.options) {
                body.options = {}
              }
              body.options.limit = arg
              return this
            },
            skip(arg) {
              if (!body.options) {
                body.options = {}
              }
              body.options.skip = arg
              return this
            },
            sort(arg) {
              if (!body.options) {
                body.options = {}
              }
              body.options.sort = arg
              return this
            },
            projection(arg) {
              body.projection = arg
              return this
            },
            resolve: deferred.resolve,
            reject: deferred.reject,
            then: (onResolve: (res: AxiosResponse) => void, onReject?: (e) => void) => {
              exec()
              return deferred.then(onResolve, onReject)
            }
          }
        },
        findOne(filter?: any, projection?: any) {
          const body: any = {}
          if (filter) {
            body.filter = filter
          }
          if (projection) {
            body.projection = projection
          }

          const deferred = createDeferred<AxiosResponse>()

          const exec = async () =>
            ax
              .post(`data/documents/${collection}/findOne`, body)
              .then(deferred.resolve, deferred.reject)
          return {
            populate(arg) {
              if (!body.populate) body.populate = []
              body.populate.push(arg)
              return this
            },
            projection(arg) {
              body.projection = arg
              return this
            },
            resolve: deferred.resolve,
            reject: deferred.reject,
            then: (onResolve: (res: AxiosResponse) => void, onReject?: (e) => void) => {
              exec()
              return deferred.then(onResolve, onReject)
            }
          }
        },
        // no exec
        count(filter?: any) {
          const body: any = {}
          if (filter) {
            body.filter = filter
          }
          return ax.post(`data/documents/${collection}/count`, body)
        },
        create: async document => ax.post(`data/documents/${collection}/create`, document),
        deleteOne: payload => ax.post(`data/documents/${collection}/deleteOne`, payload),
        updateOne: (filter, update) =>
          ax.post(`data/documents/${collection}/updateOne`, { filter, update }),
        deleteMany: filter => ax.post(`data/documents/${collection}/deleteMany`, filter),
        AccessControl: {
          getAccessConfig() {
            return ax.get(`data/collections/access-config/${collection}`);
          },
          resetConfig() {
            let url = `data/collections/access-config/${collection}`;
            return ax.delete(url);
          },
          updateConfig(config) {
            return ax.post(`data/collections/access-config/${collection}`, config);
          },
        }
      }
    },
    Auth: {
      loginUrl: `${baseUrl}login`,
      registerUrl: `${baseUrl}register`,
      getLoginUrl: function (returnUrl?: string) {
        if (!returnUrl) returnUrl = window.location.href;
        const encodedReturnUrl = btoa(returnUrl);
        return `${this.loginUrl}?redirect=${encodedReturnUrl}`
      },
      getRegisterUrl: function (returnUrl?: string) {
        if (!returnUrl) returnUrl = window.location.href;
        const encodedReturnUrl = btoa(returnUrl);
        return `${this.registerUrl}?redirect=${encodedReturnUrl}`
      },
      redirectToLogin: function (returnUrl?: string) {
        window.location.href = this.getLoginUrl(returnUrl);
      },
      redirectToRegister: function (returnUrl?: string) {
        window.location.href = this.getRegisterUrl(returnUrl);
      },
      me: () => ax.get(`user/auth/me`),
      logout: () => ax.post(`user/auth/logout`),
    },
    axiosClient: ax,
    setAxiosClient: arg => (ax = arg)
  }
}

export { createClient }
