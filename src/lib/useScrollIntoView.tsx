import { useCallback, useRef } from "react";

export function useScrollIntoView() {
    const ref = useRef<null | HTMLDivElement>(null);
    const scrollIntoView = useCallback(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" })
        console.log("xx", ref.current?.scrollIntoView)
    }, []);
    return [ref, scrollIntoView] as const;
}

