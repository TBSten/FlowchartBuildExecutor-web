import { deepCopy } from "util/functions";
import { actionTypes } from "./actions";
import { init } from "./initialState";

export default function appReducer(
    state = init,
    action: { type: string; payload: any }
) {
    let newState = deepCopy(state);
    if (action.type === actionTypes.dialog.show) {
        newState.dialog.open = true;
        newState.dialog.content = action.payload;
    } else if (action.type === actionTypes.dialog.hide) {
        newState.dialog.open = false;
        newState.dialog.content = "";
        //onCloseの発火
        if (state.dialog.open === true) {
            newState.dialog.onClose();
        }
        console.log("--- hide ", newState.dialog);
    } else if (action.type === actionTypes.dialog.setOnClose) {
        newState.dialog.onClose = action.payload;
    } else if (action.type === actionTypes.snackbar.show) {
        newState.snackbar.open = true;
        newState.snackbar.content = action.payload;
    } else if (action.type === actionTypes.snackbar.hide) {
        newState.snackbar.open = false;
        newState.snackbar.content = "";
        //onCloseの発火
        if (state.snackbar.open === true) {
            newState.snackbar.onClose();
        }
    } else if (action.type === actionTypes.snackbar.setOnClose) {
        console.log("snackbar set onClose !");
        newState.snackbar.onClose = action.payload;
    } else if (action.type === actionTypes.isLoading.set) {
        newState.isLoading = action.payload;
    }

    const value: number = action.payload;
    switch (action.type) {
        case actionTypes.zoom.set:
            newState.zoom = value;
            break;
        case actionTypes.zoom.inc:
            const newZoom = newState.zoom + value;
            if (0 <= newZoom && newZoom < 2) {
                newState.zoom = newZoom;
            }
            break;
        case actionTypes.clipboard.set:
            newState.clipboard = [...action.payload];
            break;
        case actionTypes.clipboard.unset:
            newState.clipboard = [];
            break;
        case actionTypes.dragAndDrop.from.set:
            newState.dragAndDrop.from = action.payload;
            break;
        case actionTypes.dragAndDrop.to.set:
            newState.dragAndDrop.to = action.payload;
            break;
    }

    if (action.type === actionTypes.runtime.set) {
        const newRuntime = action.payload;
        newState.runtime = newRuntime;
    } else if (action.type === actionTypes.executingId.set) {
        const newId = action.payload;
        newState.executingId = newId;
    }

    switch (action.type) {
        case actionTypes.mode.set:
            console.log("mode set", action.payload);
            newState.mode = action.payload;
            break;
    }

    if (action.type === actionTypes.selectItem.select) {
        let selectItemId = action.payload;
        const isInclude = newState.selectItemIds.includes(selectItemId);
        //newState.selectItemIdを操作
        if (newState.multiSelect) {
            //複数選択
            if (selectItemId === "none") {
                //選択解除
                newState.selectItemId = "none";
                newState.selectItemIds = [];
            } else if (isInclude) {
                newState.selectItemIds = newState.selectItemIds.filter((ele) => ele !== selectItemId);
                if (newState.selectItemId === selectItemId) {
                } else {
                    newState.selectItemId = newState.selectItemIds[newState.selectItemIds.length - 1];
                }
            } else {
                //新規追加
                newState.selectItemId = selectItemId;
                newState.selectItemIds.push(selectItemId);
            }
        } else {
            //単数選択
            if (newState.selectItemId === selectItemId) {
                newState.selectItemId = "none";
                newState.selectItemIds = [];
            } else {
                newState.selectItemId = selectItemId;
                newState.selectItemIds = [selectItemId];
            }
        }
    } else if (action.type === actionTypes.selectItem.unselect) {
        let selectItemId = action.payload;
        const selectItemIdx = newState.selectItemIds.indexOf(selectItemId) - 1;
        if (newState.selectItemId === selectItemId) {
            console.log("new selectItemId :", newState.selectItemIds[selectItemIdx], selectItemIdx);
            newState.selectItemId = newState.selectItemIds[selectItemIdx];
        }
        newState.selectItemIds = newState.selectItemIds.filter((ele) => ele !== selectItemId);
    } else if (action.type === actionTypes.selectItem.toggleMulti) {
        const value = action.payload ? true : false;
        newState.multiSelect = value;
        if (!value) {
            newState.selectItemIds = [newState.selectItemId];
        }
    }

    return newState;
}
