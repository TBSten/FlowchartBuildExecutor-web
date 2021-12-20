import { useDispatch, useSelector } from "react-redux";
import { init } from "./initialState";
import {
    openAppDialog,
    hideAppDialog,
    openAppSnackbar,
    hideAppSnackbar,
    setIsLoading,
    setClipboard,
    setDragAndDropTo,
    unsetClipboard,
    setDragAndDropFrom,
    setOnCloseAppSnackbar,
} from "./actions";

export function useAppDialog() {
    useSelector((state: { app: typeof init }) => state.app.dialog.content);
    const dialog = useSelector(
        (state: { app: typeof init }) => state.app.dialog
    );
    const dispatch = useDispatch();
    function show(content: React.ReactNode) {
        dispatch(openAppDialog(content));
    }
    function hide() {
        dispatch(hideAppDialog());
    }
    //console.log();
    return {
        ...dialog,
        show,
        hide,
    };
}
export function useAppSnackbar() {
    useSelector((state: { app: typeof init }) => state.app.snackbar);
    const snackbar = useSelector(
        (state: { app: typeof init }) => state.app.snackbar
    );
    const dispatch = useDispatch();
    function show(content: React.ReactNode) {
        dispatch(setOnCloseAppSnackbar(
            ()=>dispatch(hideAppSnackbar()))
        );
        dispatch(openAppSnackbar(content));
        alert("close !");
    }
    function hide() {
        dispatch(hideAppSnackbar());
    }
    return {
        ...snackbar,
        show,
        hide,
    };
}
export function useIsLoading() {
    const isLoading = useSelector(
        (state: { app: typeof init }) => state.app.isLoading
    );
    const dispatch = useDispatch();
    const startLoad = () => {
        dispatch(setIsLoading(true));
    };
    const finishLoad = () => {
        dispatch(setIsLoading(false));
    };
    const heavy = async (callback: () => Promise<void>) => {
        startLoad();
        await callback();
        finishLoad();
        return;
    };
    return {
        isLoading,
        startLoad,
        finishLoad,
        heavy,
    };
}

export function useZoom() {
    const zoom = useSelector(
        (state: { app: typeof init }) => state.app.zoom
    );
    return zoom;
}
export function useClipboard() {
    const clipboard = useSelector(
        (state: { app: typeof init }) => state.app.clipboard
    );
    const dispatch = useDispatch();
    function set(ids: string[]) {
        dispatch(setClipboard(ids));
    }
    function unset() {
        dispatch(unsetClipboard());
    }
    return {
        clipboard,
        set,
        unset,
    };
}
export function useDragAndDrop() {
    const { from, to } = useSelector(
        (state: { app: typeof init }) => state.app.dragAndDrop
    );
    const dispatch = useDispatch();
    function setFrom(itemId: string) {
        dispatch(setDragAndDropFrom(itemId));
    }
    function setTo(itemId: string) {
        dispatch(setDragAndDropTo(itemId));
    }
    return {
        from,
        to,
        setFrom,
        setTo,
    };
}

export function useRuntime(){
    const runtime = useSelector(
        (state:{app:typeof init}) => state.app.runtime
    );
    return runtime ;
}
export function useExecutingId(){
    const ans = useSelector(
        (state :{app:typeof init}) => (state.app.executingId),
    );
    return ans ;
}

export function useMode(){
    const mode = useSelector((state:{app:typeof init}) => state.app.mode);
    return mode ;
}

export function useSelectItemId(){
    const selectItem = useSelector((state:{app:typeof init}) => state.app.selectItemId);
    return selectItem ;
}
export function useSelectItemIds() :string[]{
    const selectItemIds = useSelector((state:{app:typeof init}) => state.app.selectItemIds);
    return selectItemIds ;
}
export function useMultiSelect() :boolean{
    const multiSelect = useSelector((state:{app:typeof init}) => state.app.multiSelect);
    return multiSelect ;
}






