import { } from "src/execute/eval";
import { logger } from "src/lib/logger";
import { notImplementError } from "src/lib/notImplement";
import { isString } from "src/lib/typechecker";
import { getOption } from "../option";
import { ItemExecute } from "../types";

export const processExecute: ItemExecute = async ({
    item,
    runtime,
}) => {
    const flowName = getOption(item, "処理名")?.value;
    logger.log(flowName)
    if (!isString(flowName)) throw notImplementError();
    const flowId = runtime.getProcessFlowId(flowName);
    logger.log(flowId);
    if (!flowId) throw notImplementError();
    runtime.executingItemIds = [
        flowId,
        ...runtime.executingItemIds,
    ];
    return;
};




