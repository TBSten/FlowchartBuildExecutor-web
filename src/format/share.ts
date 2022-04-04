import { FBE_SAVEPOINT_BACKEND_URL } from "src/lib/constants";
import { isSaveFormat, SAVE_KEYS, storeStateToSaveFormat } from "./util";
import storeJs from "storejs";
import { notImplementError } from "src/lib/error";
import { logger } from "src/lib/logger";

export async function saveToServer() {
    const fbe = storeStateToSaveFormat();
    const res = await fetch(FBE_SAVEPOINT_BACKEND_URL, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({
            fbe,
        }),
    });
    const json = await res?.json();
    const id = json?.tmpSaveId;
    if (typeof id !== "string") {
        logger.error("res", res);
        logger.error("json", json);
        throw notImplementError(`invalid response`);
    }
    storeJs(SAVE_KEYS.SERVER_SAVEPOINT_ID, id);
    return id;
}
export async function getFromServer(id?: string) {
    if (!id) {
        id = storeJs(SAVE_KEYS.SERVER_SAVEPOINT_ID);
    }
    if (!id) return;
    const res = await fetch(FBE_SAVEPOINT_BACKEND_URL + `?id=${id}`, {
        method: "GET",
    });
    const json = await res.json();
    const saveData = json?.result;
    if (!isSaveFormat(saveData)) {
        console.error("res", res)
        console.error("json", json)
        console.error("saveData", saveData);
        throw notImplementError(`invalid save data from server : ${saveData} `);
    }
    logger.log(`get save data from server by id : ${id}`, saveData);
    return saveData;
}
