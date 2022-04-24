import { useDispatch, useSelector } from "react-redux";
import {
    getDraggingItemId,
    getLogs,
    getMode,
    getSelectItemIds,
    getZoom,
    isExistsChange as isExistsChangeSelector,
} from "./selectors";
import { Mode } from "./types";
import {
    setMode,
    selectItemMulti,
    selectItemOne,
    unselectItem,
    incZoom,
    setZoom,
    notifyChange as notifyChangeAction,
    resetChangeCount as resetChangeCountAction,
    setSelectMode,
    setDraggingItemId,
} from "./actions";
import { ItemId } from "../items/types";
import { DragEventHandler, useCallback } from "react";
import { getAllItems } from "../items/selectors";
import { getFlowIds } from "../meta/selectors";
import { useAppSelector } from "src/redux/root/hooks";
import { useItemOperations } from "../items/hooks";
import { saveToBrowser } from "src/format/browser";
import { sleep } from "src/lib/sleep";

export function useMode() {
    const mode = useAppSelector(getMode());
    const dispatch = useDispatch();
    const set = (mode: Mode) => {
        dispatch(setMode({ mode }));
    };
    return [mode, set] as const;
}

export function useSelectItemIds() {
    const selectItemIds = useAppSelector(getSelectItemIds());
    const dispatch = useDispatch();
    const add = (...itemIds: ItemId[]) => {
        dispatch(selectItemMulti({ itemIds: itemIds }));
    };
    const unselect = () => {
        dispatch(unselectItem());
    };
    const selectOne = (itemId: ItemId) => {
        dispatch(selectItemOne({ itemId }));
    };
    return [
        selectItemIds,
        {
            selectOne,
            add,
            unselect,
        },
    ] as const;
}

export function useSelectMode() {
    const mode = useAppSelector(state => state.app.selectMode);
    const dispatch = useDispatch();
    const set = (mode: "single" | "multi") => {
        dispatch(setSelectMode({ selectMode: mode }));
    };
    return [
        mode,
        set,
    ] as const;
}

export function useZoom() {
    const zoom = useAppSelector(getZoom());
    const dispatch = useDispatch();
    const set = useCallback(
        (zoom: number) => {
            dispatch(setZoom({ zoom }));
        },
        [dispatch]
    );
    const inc = useCallback(
        (zoom: number) => {
            dispatch(incZoom({ zoom }));
        },
        [dispatch]
    );
    return [zoom, set, inc] as const;
}

export function useChange() {
    const isExistsChange = useAppSelector(isExistsChangeSelector());
    const dispatch = useDispatch();
    const notifyChange = async () => {
        dispatch(notifyChangeAction());
        saveToBrowser();
        await sleep(1000);
        dispatch(resetChangeCountAction());
    };
    const resetChangeCount = () => {
        dispatch(resetChangeCountAction());
    };
    return {
        isExistsChange,
        notifyChange,
        resetChangeCount,
    } as const;
}


export function useRuntime() {
    const runtime = useAppSelector(state => state.app.runtime);
    const items = useAppSelector(getAllItems());
    const topFlowIds = useAppSelector(getFlowIds());
    useAppSelector(state => state.app.runtime?.status);
    const executeUtilities = useExecute();
    const initialize = useCallback(() => {
        if (!runtime) return;
        runtime.initialize(items, topFlowIds);
        runtime.flush();
    }, [runtime, items, topFlowIds,]);
    return {
        runtime,
        initialize,
        ...executeUtilities,
    } as const;
}
export function useExecute() {
    const runtime = useAppSelector((state) => state.app.runtime);
    const status = useAppSelector(state => state.app.runtime?.status)
    const isFinished = useAppSelector(state => (state.app.runtime?.isFinished()))
    useAppSelector(state => state.app.runtime?.status)
    const executeNext = useCallback(() => {
        if (!runtime) return;
        runtime.executeNext();
        runtime.flush();
    }, [runtime]);
    const executeAll = useCallback(() => {
        if (!runtime) return;
        runtime.executeAll();
        runtime.flush();
    }, [runtime]);
    const stop = useCallback(() => {
        if (!runtime) return;
        runtime.stop();
        runtime.flush();
    }, [runtime]);
    const canExecuteAll = status === "BEFORE_START";
    const canStop = !isFinished;
    const canExecuteNext = !isFinished;
    return {
        executeNext,
        canExecuteNext,
        executeAll,
        stop,
        canExecuteAll,
        canStop,
    } as const;
}

export function useLogs() {
    const logs = useSelector(getLogs());
    return {
        logs,
    };
}

const TRANSFER_KEY = "FBE_DRAGGING_ITEM_ID";
export function useDragAndDropItem(itemId: ItemId) {
    const dispatch = useDispatch();
    const isDragging = useSelector(getDraggingItemId()) === itemId;
    const { exchangeItems } = useItemOperations();
    const [selectItemIds, { selectOne }] = useSelectItemIds();
    const onDragStart: DragEventHandler = (e) => {
        dispatch(setDraggingItemId({ itemId }))
        e.dataTransfer.setData(TRANSFER_KEY, itemId);
        selectOne(itemId);
    };
    const onDrop: DragEventHandler = (e) => {
        dispatch(setDraggingItemId({ itemId: null }))
        const fromId = e.dataTransfer.getData(TRANSFER_KEY);
        const toId = itemId;
        exchangeItems(fromId, toId);
    };
    const onDragEnd: DragEventHandler = () => {
        dispatch(setDraggingItemId({ itemId: null }))
    }
    const onDragEnter: DragEventHandler = (e) => {
        e.preventDefault();
        if (e.dataTransfer.getData(TRANSFER_KEY) !== itemId) {
        }
    };
    const onDragOver: DragEventHandler = (e) => {
        e.preventDefault();
    };
    return {
        isDragging,
        onDragStart,
        onDragEnd,
        onDrop,
        onDragEnter,
        onDragOver,
        draggable: true,
    }
}


