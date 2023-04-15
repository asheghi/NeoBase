import { useRef, useEffect } from 'react'

export default function usePrevious<T>(
  value: T,
  callback?: (prevValue: T | undefined, currentValue: T) => void
): T {
  const ref = useRef<T>()

  useEffect(() => {
    if (callback) {
      callback(ref.current, value)
    }
    ref.current = value
  }, [callback, value])

  return ref.current as T
}