import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { FC, ReactNode, useState } from "react";

export type ConfirmDialogProps = DialogProps & {
    open: boolean;
    onOk: () => any;
    onCancel: () => any;
};

/**
 * ## Usage
 *
 * ```tsx
 * const [confirm,dialogProps] = useConfirmDialog("is ok ?") ;
 *
 * <ConfirmDialog {...dialogProps}/>
 *
 * ```
 *
 */
const ConfirmDialog: FC<ConfirmDialogProps> = ({
    open,
    children,
    onOk,
    onCancel,
    onClose,
    ...other
}) => {
    const handleOk = ()=>{
        onOk();
        if(onClose) onClose({},"backdropClick");
    } ;
    const handleCancel = ()=>{
        onCancel();
        if(onClose) onClose({},"backdropClick");
    } ;
    return (
        <Dialog open={open} onClose={onClose} {...other}>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleOk}>
                    OK
                </Button>
                <Button variant="text" onClick={handleCancel}>
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmDialog;

export function useConfirmDialog(content: ReactNode) {
    const [open, setOpen] = useState(false);
    const confirm = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const onOk = () => {};
    const onCancel = () => {};

    return [
        confirm,
        {
            open,
            onClose,
            onOk,
            onCancel,
            children: content,
        } as ConfirmDialogProps,
    ] as const;
}
