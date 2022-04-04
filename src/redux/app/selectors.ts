import { ItemId } from "../items/types";
import { StoreState } from "../store";

export const getMode = () => (state: StoreState) => state.app.mode;

export const getSelectItemIds = () => (state: StoreState) => state.app.selectItemIds;
export const isSelecting = (itemId: ItemId) => (state: StoreState) => state.app.selectItemIds.includes(itemId);
export const getSelectMode = () => (state: StoreState) => state.app.selectMode;


export const getRuntimeTabs = () => (state: StoreState) => {
    if (!state.app.runtime) return null;
    return state.app.runtime.tabs;
};
export const getRuntimeTab = (label: string) => (state: StoreState) => {
    const tabs = getRuntimeTabs()(state);
    if (!tabs) return null;
    const tab = tabs.find(tab => tab.label === label);
    if (!tab) return null;
    return tab;
};
export const getExecutingItemId = () => (state: StoreState) => state.app.runtime?.executingItemIds;

export const getGuideContent = () => (state: StoreState) => state.app.guideContent;

export const getLogs = () => (state: StoreState) => state.app.logs;

export const getZoom = () => (state: StoreState) => state.app.zoom;

export const isExistsChange = () => (state: StoreState) => state.app.changeCount > 0;

export const getDraggingItemId = () => (state: StoreState) => state.app.draggingItemId;

export const getEmphasisTarget = () => (state: StoreState) => state.app.emphasisTarget;


