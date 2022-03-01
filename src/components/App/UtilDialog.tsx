import { Dialog } from "@mui/material";
import { FC, useCallback, useState } from "react";


export interface UtilDialogProps {
    open: boolean,
    onClose?: () => any,
}
const UtilDialog: FC<UtilDialogProps> = ({ open, onClose, children }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            {children}
        </Dialog>
    );
};

export default UtilDialog;

export interface UseUtilDialogArg {
    defaultOpen?: boolean,
}
export function useUtilDialog({
    defaultOpen = false,
}: UseUtilDialogArg) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const open = useCallback(() => { setIsOpen(true) }, [])
    const close = useCallback(() => { setIsOpen(false) }, [])
    const toggle = useCallback(() => { setIsOpen(prev => !prev) }, [])
    return [
        isOpen,
        {
            open: isOpen,
            onClose: close,
        } as UtilDialogProps,
        {
            open,
            close,
            toggle,
        }
    ] as const;
}

