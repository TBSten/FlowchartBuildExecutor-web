import Runtime from "exe/runtimes/Runtime";
import { ReactNode } from "react";

export const init = {
    dialog: {
        open: false,
        content: "" as ReactNode,
        onClose: () => {},
    },
    snackbar: {
        open: false,
        content: "" as ReactNode,
        onClose: () => {},
    },
    isLoading: true,

    zoom: 1.0,
    clipboard: [] as string[], //削除可能
    dragAndDrop: {
        from: "",
        to: "",
    },

    runtime: null as null | Runtime,
    executingId: "none",

    mode: "edit",

    selectItemId: "none",
    selectItemIds: [] as string[],
    multiSelect: false,

};
