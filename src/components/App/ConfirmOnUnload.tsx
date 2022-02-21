import { FC , useEffect } from "react";
import { useChange } from "src/redux/app/operations";


export interface ConfirmOnUnloadProps {}

const ConfirmOnUnload: FC<ConfirmOnUnloadProps> = () => {
    const {isExistsChange} = useChange() ;
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if(isExistsChange){
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isExistsChange]);
    return <></>;
};
export default ConfirmOnUnload;
