import { useDispatch, useSelector } from "react-redux";
import {
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
} from "./actions";
import { ItemId } from "../items/types";
import { useCallback } from "react";
import { StoreState } from "../store";

export function useMode() {
    const mode = useSelector(getMode());
    const dispatch = useDispatch();
    const set = (mode: Mode) => {
        dispatch(setMode({ mode }));
    };
    return [mode, set] as const;
}

export function useSelectItemIds() {
    const selectItemIds = useSelector(getSelectItemIds());
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
    const mode = useSelector((state: StoreState) => state.app.selectMode);
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
    const zoom = useSelector(getZoom());
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
    const isExistsChange = useSelector(isExistsChangeSelector());
    const dispatch = useDispatch();
    const notifyChange = () => {
        dispatch(notifyChangeAction());
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





