import { Runtime } from "src/execute/runtime/Runtime";
import { notImplement } from "src/lib/error";
import { Item } from "src/redux/items/types";
import { getOption } from "../option";
import { ItemExecute } from "../types";

export const whileExecute: ItemExecute = async ({ item, runtime }) => {
    const condition = getOption(item, "ループ条件")?.value;
    const type = getOption(item, "判定タイミング")?.value;
    const flowId = item.childrenItemIds[0];
    if (typeof condition === "string" && typeof flowId === "string") {
        if (type === "前判定") {
            return await onTopBaseLoop(item, runtime);
        } else if (type === "後判定") {
            return await onBottomBaseLoop(item, runtime);
        }
    }
    notImplement();
};

async function onTopBaseLoop(item: Item, runtime: Runtime) {
    //item.option["ループ条件"] === trueなら runtime.executingItemIds.add(item.childrenItemIds[0],item.itemId)
    const condition = getOption(item, "ループ条件")?.value;
    if (typeof condition === "string") {
        const evaled = await runtime.eval(condition);
        if (evaled === true) {
            runtime.executingItemIds = [
                item.childrenItemIds[0],
                item.itemId,
                ...runtime.executingItemIds,
            ];
            return;
        } else if (evaled === false) {
            return;
        }
    }
    notImplement();
}
async function onBottomBaseLoop(item: Item, runtime: Runtime) {
    const firstKey = `${item.itemId}/flg`;
    const isFirst = runtime.getTempData(firstKey) !== true;
    if (isFirst) {
        runtime.setTempData(firstKey, true);
        runtime.executingItemIds = [
            item.childrenItemIds[0],
            item.itemId,
            ...runtime.executingItemIds,
        ];
    } else {
        onTopBaseLoop(item, runtime);
    }
}
