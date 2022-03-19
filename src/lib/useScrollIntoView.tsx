import { useCallback, useRef } from "react";
import { logger } from "./logger";

export function useScrollIntoView() {
    const ref = useRef<null | HTMLDivElement>(null);
    const scrollIntoView = useCallback(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" })
        logger.log("xx", ref.current?.scrollIntoView)
    }, []);
    return [ref, scrollIntoView] as const;
}

