import { FBE_VERSION } from "src/lib/constants";
import { logger } from "src/lib/logger";
import { Item, ItemId } from "src/redux/items/types";
import { store } from "src/redux/store";
import { loadSaveFormatToStoreState } from "./browser";

export const pre = "FBE_TEMP_";
export const SAVE_KEYS = {
    FBE_SAVE_DATA: pre + "SAVE_DATA_KEY",
    SERVER_SAVEPOINT_ID: pre + "SERVER_SAVEPOINT_ID",
    ZOOM: pre + "ZOOM",
    RUNTIME_NAME: pre + "RUNTIME_NAME",
}

//FBE セーブ

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
        version: FBE_VERSION,
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
export function loadJson(obj: any) {
    if (isSaveFormat(obj)) {
        loadSaveFormatToStoreState(obj);
    } else {
        logger.error("invalid", obj)
        throw new Error(`invalid argument of loadJson`);
    }
}
