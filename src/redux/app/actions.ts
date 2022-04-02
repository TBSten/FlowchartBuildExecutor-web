import { ReactNode } from "react";
import { Runtime } from "src/execute/runtime/Runtime";
import { Log } from "src/lib/logger";
import actionCreatorFactory from "typescript-fsa";
import { ItemId } from "../items/types";
import { Mode, } from "./types";

const actionCreator = actionCreatorFactory();

export const setMode = actionCreator<{ mode: Mode }>("app/mode/set");
export const executeMode = actionCreator("app/mode/set/execute");
export const editMode = actionCreator("app/mode/set/edit");
export const exportMode = actionCreator("app/mode/set/export");

export const selectItemOne = actionCreator<{ itemId: ItemId }>("app/selectItemIds/selectOne");
export const selectItemMulti = actionCreator<{ itemIds: ItemId[] }>("app/selectItemIds/selectMulti");
export const unselectItem = actionCreator("app/selectItemIds/unselect");
export const setSelectMode = actionCreator<{ selectMode: "single" | "multi" }>("app/selectMode/set");

export const setRuntime = actionCreator<{ runtime: Runtime | null }>("app/runtime/set");

export const setGuideContent = actionCreator<{ guideContent: ReactNode }>("app/guideContent/set");

export const clearLogs = actionCreator<{}>("app/logs/clear");
export const addLogs = actionCreator<{ log: Log }>("app/logs/add");

export const setZoom = actionCreator<{ zoom: number }>("app/zoom/set");
export const incZoom = actionCreator<{ zoom: number }>("app/zoom/inc");

export const notifyChange = actionCreator("app/changeCount/notify");
export const resetChangeCount = actionCreator("app/changeCount/reset");

export const setDraggingItemId = actionCreator<{ itemId: ItemId | null }>("app/draggingItemId/set");

export const setEmphasisTarget = actionCreator<{ key: string }>("app/emphasisTarget/set");

