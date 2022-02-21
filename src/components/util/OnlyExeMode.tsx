import { FC, ReactNode } from "react";
import { useMode } from "src/redux/app/operations";

export interface OnlyEditModeProps {
    fallback? : ReactNode ;
}

const OnlyEditMode: FC<OnlyEditModeProps> = ({children,fallback}) => {
    const [mode] = useMode() ;
    return mode === "execute" ? <>{children}</> : <>{fallback}</> ;
}
export default OnlyEditMode ;

