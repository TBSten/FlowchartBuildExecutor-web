import Dialog, { DialogProps } from "@mui/material/Dialog";
import { useState } from "react";

export function useDialog(initOpen: boolean = false) {
    const [open, setOpen] = useState(initOpen);
    const openDialog = () => {
        setOpen(true);
    };
    const closeDialog = () => {
        setOpen(false);
    };
    const props: DialogProps = {
        open,
        onClose: closeDialog,
    };
    return [
        Dialog,
        props,
        {
            open: openDialog,
            close: closeDialog,
        },
    ] as const;
}
