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
  baseurl?: string
  getToken?: (...args: any[]) => string
}

function getClient(baseurl, { getToken }: ClientOptions = {}) {
  let ax = axios.create({
    baseURL: baseurl
  })

  // set user token
  if (getToken) {
    if (typeof getToken !== 'function') throw new Error('getToken option must be a function')
    ax.interceptors.request.use((config: AxiosRequestConfig & { dontSetToken?: boolean }) => {
      try {
        if (!config.dontSetToken) config.headers!['x-auth-token'] = getToken()
      } catch (e) {
        console.error(e)
      }
      return config
    })
  }

  return {
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
              .post(`documents/${collection}/find`, body)
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
            then: (onResolve: (res: AxiosResponse) => void, onReject: (e) => void) => {
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
              .post(`documents/${collection}/findOne`, body)
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
            then: (onResolve: (res: AxiosResponse) => void, onReject: (e) => void) => {
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
          return ax.post(`documents/${collection}/count`, body)
        },
        create: async document => ax.post(`documents/${collection}/create`, document),
        deleteOne: payload => ax.post(`documents/${collection}/deleteOne`, payload),
        updateOne: (filter, update) =>
          ax.post(`documents/${collection}/updateOne`, { filter, update }),
        deleteMany: filter => ax.post(`documents/${collection}/deleteMany`, filter)
      }
    },
    Auth: {
      login: payload => ax.post(`auth/login`, payload),
      register: payload => ax.post(`auth/register`, payload),
      me: token => ax.get(`auth/me`, { headers: { 'x-auth-token': token } })
    },
    axiosClient: ax,
    setAxiosClient: arg => (ax = arg)
  }
}

export { getClient }
