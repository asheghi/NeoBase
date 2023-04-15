import { useEffect } from 'react'
import usePrevious from './usePrevious'

export default function useWatch<T>(
    value: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    watchFn?: (prev: T, current: T, ...args: any[]) => void,
    name?: string
) {
    const prev = usePrevious(value)

    useEffect(() => {
        if (!watchFn) {
            // eslint-disable-next-line no-console
            console.log((name ?? 'state') + ' changed', { previous: prev, current: value })
        } else {
            watchFn(prev, value)
        }
    }, [prev, value, watchFn])
}