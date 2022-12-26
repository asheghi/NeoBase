type Resolve<T> = (v: T) => void
type Reject = (e: Error) => void

export interface IDeferred<T> {
  resolve: Resolve<T>
  reject: Reject
  then(onResolved: Resolve<T>, onRejected: Reject): Promise<unknown>
}

export function createDeferred<T = void>(): IDeferred<T> {
  let resolve: Resolve<T> | undefined, reject: Reject | undefined

  const promise = new Promise<T>((...args) => {
    return ([resolve, reject] = args)
  })

  return Object.freeze(<IDeferred<T>>{
    resolve: resolve!,
    reject: reject!,
    then: (...args) => promise.then(...args)
  })
}
