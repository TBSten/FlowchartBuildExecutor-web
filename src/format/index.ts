import { VERSION } from "src/lib/constants";
import { logger } from "src/lib/logger";
import { loadItems } from "src/redux/items/actions";
import { Item, ItemId } from "src/redux/items/types";
import { loadMeta } from "src/redux/meta/actions";
import { store } from "src/redux/store";
import storeJs from "storejs";

export interface SaveFormat {
    version: string;
    items: Item[];
    meta: {
        flowIds: ItemId[];
        title: string;
    };
}
export function isSaveFormat(arg: any): arg is SaveFormat {
    return (
        arg &&
        typeof arg === "object" &&
        typeof arg.version === "string" &&
        arg.items instanceof Array &&
        typeof arg.meta === "object" &&
        arg.meta.flowIds instanceof Array &&
        typeof arg.meta.title === "string"
    );
}

export function toSaveFormat({
    items,
    flowIds,
    title,
}: {
    items: Item[];
    flowIds: ItemId[];
    title: string;
}): SaveFormat {
    return {
        version: VERSION,
        items,
        meta: {
            flowIds,
            title,
        },
    };
}
export function storeStateToSaveFormat() {
    const state = store.getState();

    const items = state.items;
    const flowIds = state.meta.flowIds;
    const title = state.meta.title;

    return toSaveFormat({
        items,
        flowIds,
        title,
    });
}
export function saveFormatToJson(saveFormat: SaveFormat) {
    return JSON.stringify(saveFormat);
}
export function storeStateToJson() {
    return saveFormatToJson(storeStateToSaveFormat());
}
const SAVE_KEY = "FBE_TEMP_SAVE_DATA_KEY";
export function saveToBrowser() {
    const saveFormat = storeStateToJson();
    storeJs(SAVE_KEY, saveFormat);
}
export function resetBrowserSave() {
    storeJs.remove(SAVE_KEY)
}

export function loadSaveFormatToStoreState(saveFormat: SaveFormat) {
    logger.log("load", saveFormat)
    store.dispatch(loadMeta({
        meta: {
            ...saveFormat.meta,
            flowIds: [],
        }
    }))
    store.dispatch(loadItems({
        items: saveFormat.items,
    }));
    store.dispatch(loadMeta({
        meta: saveFormat.meta,
    }));
}

export function loadJson(obj: any) {
    if (isSaveFormat(obj)) {
        loadSaveFormatToStoreState(obj);
    } else {
        logger.error("invalid", obj)
        throw new Error(`invalid argument of loadJson`);
    }
}

export function loadFromBrowser() {
    const saveFormat = storeJs(SAVE_KEY);
    if (saveFormat) {
        loadJson(JSON.parse(saveFormat));
    }
}

