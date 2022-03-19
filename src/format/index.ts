import { isNumber, isString } from "lodash";
import { useEffect } from "react";
import { getRuntimeKeys } from "src/execute/runtime";
import { VERSION } from "src/lib/constants";
import { logger } from "src/lib/logger";
import { useZoom } from "src/redux/app/operations";
import { loadItems } from "src/redux/items/actions";
import { Item, ItemId } from "src/redux/items/types";
import { loadMeta } from "src/redux/meta/actions";
import { store } from "src/redux/store";
import { useSp } from "src/style/media";
import storeJs from "storejs";

const pre = "FBE_TEMP_";
const SAVE_KEYS = {
    FBE_SAVE_DATA: pre + "SAVE_DATA_KEY",
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
// const SAVE_KEY = "FBE_TEMP_SAVE_DATA_KEY";
export function saveToBrowser() {
    const saveFormat = storeStateToJson();
    storeJs(SAVE_KEYS.FBE_SAVE_DATA, saveFormat);
}
export function resetBrowserSave() {
    storeJs.remove(SAVE_KEYS.FBE_SAVE_DATA)
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
    const saveFormat = storeJs(SAVE_KEYS.FBE_SAVE_DATA);
    if (saveFormat) {
        loadJson(JSON.parse(saveFormat));
    }
}


// アプリデータ

function defaultZoom() {
    return store.getState().app.zoom;
}
function defaultRuntimeName() {
    return getRuntimeKeys()[0];
}
export function saveZoomToBrowser(zoom?: number) {
    if (!zoom) zoom = defaultZoom();
    console.log("saveZoomToBrowser", zoom);
    storeJs(SAVE_KEYS.ZOOM, zoom.toString());
}
export function saveRuntimeNameToBrowser(name?: string) {
    if (!name) name = defaultRuntimeName();
    storeJs(SAVE_KEYS.RUNTIME_NAME, name);
}

export function getZoomFromBrowser() {
    let zoom = storeJs(SAVE_KEYS.ZOOM);
    if (isString(zoom)) {
        return parseFloat(zoom);
    } else {
        return undefined;
    }
}
export function getRuntimeNameFromBrowser() {
    let name = storeJs(SAVE_KEYS.RUNTIME_NAME);
    if (!isString(name)) return undefined;
    return name;
}

export function useSavedZoom() {
    const result = useZoom();
    const [zoom, setZoom] = result;
    const isSp = useSp();
    useEffect(() => {
        const zoom = getZoomFromBrowser();
        if (zoom) {
            setZoom(zoom)
        } else if (isSp) {
            setZoom(0.55);
        } else {
            setZoom(1.0);
        }
    }, [isSp, setZoom])
    useEffect(() => () => saveZoomToBrowser(), [zoom])
    return result;
}

