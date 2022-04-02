import { reducerWithInitialState } from "typescript-fsa-reducers";
import { Mode } from "./types";
import { ItemId } from "../items/types";
import * as actions from "./actions";
import { Runtime } from "src/execute/runtime/Runtime";
import { ReactNode } from "react";
import { Log } from "src/lib/logger";

export const zoomUnit = 0.1;

export const init = {
    mode: "edit" as Mode,
    selectItemIds: [] as ItemId[],
    selectMode: "single" as "single" | "multi",

    runtime: null as Runtime | null,

    guideContent: null as ReactNode,

    logs: [] as Log[],

    zoom: 1.0,

    changeCount: 0,

    draggingItemId: null as ItemId | null,

    emphasisTarget: "",

};

export function changeMode(state: typeof init, mode: Mode) {
    if (state.mode === mode) return state;
    return {
        ...state,
        mode,
    };
}

export const app = reducerWithInitialState(init)
    // mode
    .case(actions.setMode, (state, payload) => {
        return changeMode(state, payload.mode);
    })
    .case(actions.editMode, (state) => {
        return changeMode(state, "edit");
    })
    .case(actions.executeMode, (state) => {
        return changeMode(state, "execute");
    })
    .case(actions.exportMode, (state) => {
        return changeMode(state, "export");
    })

    // selectItemIds
    .case(actions.selectItemOne, (state, payload) => {
        return {
            ...state,
            selectItemIds: [payload.itemId],
        };
    })
    .case(actions.selectItemMulti, (state, payload) => {
        return {
            ...state,
            selectItemIds: [...state.selectItemIds, ...payload.itemIds],
        };
    })
    .case(actions.unselectItem, (state) => {
        return {
            ...state,
            selectItemIds: [],
        };
    })

    //selectMode
    .case(actions.setSelectMode, (state, payload) => {
        if (state.selectMode === payload.selectMode) return state;
        return {
            ...state,
            selectMode: payload.selectMode,
        };
    })

    // runtime
    .case(actions.setRuntime, (state, payload) => {
        return {
            ...state,
            runtime: payload.runtime,
        };
    })

    //guideContent
    .case(actions.setGuideContent, (state, payload) => {
        if (state.guideContent === payload.guideContent) return state;
        return {
            ...state,
            guideContent: payload.guideContent,
        };
    })

    //logs
    .case(actions.addLogs, (state, payload) => {
        return {
            ...state,
            logs: [
                ...state.logs,
                payload.log,
            ]
        };
    })
    .case(actions.clearLogs, (state) => {
        return {
            ...state,
            logs: [],
        };
    })

    //zoom
    .case(actions.setZoom, (state, payload) => {
        const newValue = payload.zoom;
        if (state.zoom === payload.zoom) return state;
        return {
            ...state,
            zoom: Math.round(newValue / zoomUnit) * zoomUnit,
        };
    })
    .case(actions.incZoom, (state, payload) => {
        const newValue = state.zoom + payload.zoom;
        return {
            ...state,
            zoom: Math.round(newValue / zoomUnit) * zoomUnit,
        };
    })

    //changeCount
    .case(actions.notifyChange, (state) => {
        return {
            ...state,
            changeCount: state.changeCount + 1,
        };
    })
    .case(actions.resetChangeCount, (state) => {
        return {
            ...state,
            changeCount: 0,
        };
    })

    //draggingItemId
    .case(actions.setDraggingItemId, (state, payload) => {
        if (payload.itemId === state.draggingItemId) return state;
        return {
            ...state,
            draggingItemId: payload.itemId,
        }
    })

    //emphansisTarget
    .case(actions.setEmphasisTarget, (state, payload) => {
        if (payload.key === state.emphasisTarget) return state;
        return {
            ...state,
            emphasisTarget: payload.key,
        }
    })




