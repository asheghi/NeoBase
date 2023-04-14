import { useEffect, useRef } from "react"

export const useFirstRender = (callback: () => void) => {
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            callback();
            isFirstRender.current = false
        }
    }, [])
}