import { ReactNode } from "react";
import { Runtime } from "src/execute/runtime/Runtime";
import { Log } from "src/lib/logger";
import actionCreatorFactory from "typescript-fsa";
import { ItemId } from "../items/types";
import { Mode, } from "./types";

const actionCreator = actionCreatorFactory("app");

export const setMode = actionCreator<{ mode: Mode }>("mode/set");
export const executeMode = actionCreator("mode/set/execute");
export const editMode = actionCreator("mode/set/edit");
export const exportMode = actionCreator("mode/set/export");

export const selectItemOne = actionCreator<{ itemId: ItemId }>("selectItemIds/selectOne");
export const selectItemMulti = actionCreator<{ itemIds: ItemId[] }>("selectItemIds/selectMulti");
export const unselectItem = actionCreator("selectItemIds/unselect");
export const setSelectMode = actionCreator<{ selectMode: "single" | "multi" }>("selectMode/set");

export const setRuntime = actionCreator<{ runtime: Runtime | null }>("runtime/set");

export const setGuideContent = actionCreator<{ guideContent: ReactNode }>("guideContent/set");

export const clearLogs = actionCreator<{}>("logs/clear");
export const addLogs = actionCreator<{ log: Log }>("logs/add");

export const setZoom = actionCreator<{ zoom: number }>("zoom/set");
export const incZoom = actionCreator<{ zoom: number }>("zoom/inc");

export const notifyChange = actionCreator("changeCount/notify");
export const resetChangeCount = actionCreator("changeCount/reset");

export const setDraggingItemId = actionCreator<{ itemId: ItemId | null }>("draggingItemId/set");

export const setEmphasisTarget = actionCreator<{ key: string }>("emphasisTarget/set");

