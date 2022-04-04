import { isString } from "lodash";
import { useEffect } from "react";
import { getRuntimeKeys } from "src/execute/runtime";
import { FBE_VERSION } from "src/lib/constants";
import { logger } from "src/lib/logger";
import { useZoom } from "src/redux/app/hooks";
import { loadItems } from "src/redux/items/actions";
import { Item, ItemId } from "src/redux/items/types";
import { loadMeta } from "src/redux/meta/actions";
import { store } from "src/redux/store";
import { useSp } from "src/style/media";
import storeJs from "storejs";
import { storeStateToJson, SAVE_KEYS, SaveFormat, isSaveFormat, loadJson } from "./util";

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

