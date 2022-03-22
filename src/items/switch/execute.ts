
import { VariableValue } from "src/execute/eval";
import { logger } from "src/lib/logger";
import { notImplement, notImplementError } from "src/lib/error";
import { mustString } from "src/lib/typechecker";
import { isFlow, ItemId } from "src/redux/items/types";
import { getOption } from "../option";
import { ItemExecute } from "../types";

export const switchExecute: ItemExecute = async ({
    item,
    runtime,
}) => {
    const conOp = getOption(item, "条件")?.value;
    mustString(conOp);
    const con = await runtime.eval(conOp as string);
    let exed = false;
    const childrenId = item.childrenItemIds;
    for (let i = 0; i < childrenId.length && !exed; i++) {
        const childId = childrenId[i];
        const child = runtime.getItem(childId);
        if (!isFlow(child)) throw notImplementError();
        let tag: unknown = child.tag;
        if (child.tag === "その他") {
            tag = con;
        } else {
            tag = await runtime.eval(child.tag);
        }
        if (tag === con) {
            logger.log("branched", child.tag)
            runtime.executingItemIds = [
                childId,
                ...runtime.executingItemIds,
            ]
            exed = true;    //break;
        }
    }
    if (!exed) {
        notImplement("当てはまるものがありませんでした");
    }
    return;
};

