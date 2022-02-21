import Dialog, {DialogProps} from "@mui/material/Dialog";
import { FC, useState } from "react";

export type AppDialogProps = {
} & DialogProps ;

const AppDialog: FC<AppDialogProps> = (props) => {
    const {
        children,
        ...other
    } = props ;
    return (
        <Dialog {...other}>
            {children}
        </Dialog>
    );
};
export default AppDialog;


export type UseAppDialogArg = {
    onOpen:()=>any,
    onClose:()=>any,
};
/**
 * # usage
 * const dialog = useAppDialog({onOpen:()=>{},onClose:()=>{}}) ;
 * <Dialog {...dialog.props} />
 */
export function useAppDialog({
    onOpen=()=>{},
    onClose=()=>{},
}) {
    const [open,setOpen] = useState(false) ;
    const handleOpen = ()=>{
        onOpen();
        setOpen(true);
    } ;
    const handleClose = ()=>{
        onClose();
        setOpen(false);
    } ;
    const props:DialogProps = {
        open,
        onClose,
    } ;
    return {
        handleOpen,
        open,
        handleClose,
        props,
        component:AppDialog,
    } ;
}
