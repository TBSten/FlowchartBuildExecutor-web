import { logger } from "src/lib/logger";
import { notImplement, notImplementError } from "src/lib/error";
import { getOption } from "../option";
import { ItemExecute } from "../types";

export const ifExecute: ItemExecute = async ({
    item,
    runtime,
}) => {
    const f = getOption(item, "条件")?.value;
    if (typeof f === "string") {
        const condition = await runtime.eval(f);
        if (condition === true) {
            //yes
            const childId = item.childrenItemIds[0];
            const childFlow = runtime.getItem(childId);
            if (!childFlow) throw notImplementError();
            runtime.executingItemIds = [
                childId,
                ...runtime.executingItemIds,
            ];
            logger.log("if -> Yes");
            return;
        } else if (condition === false) {
            //no
            const childId = item.childrenItemIds[1];
            const childFlow = runtime.getItem(childId);
            if (!childFlow) throw notImplementError();
            runtime.executingItemIds = [
                childId,
                ...runtime.executingItemIds,
            ];
            logger.log("if -> No");
            return;
        }
    }
    notImplement();
};


