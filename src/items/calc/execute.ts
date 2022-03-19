import { isVariableValue } from "src/execute/eval";
import { logger } from "src/lib/logger";
import { notImplement } from "src/lib/notImplement";
import { getOption } from "../option";
import { ItemExecute } from "../types";

export const calcExecute: ItemExecute = async ({
    item,
    runtime,
}) => {
    const f = getOption(item, "式")?.value;
    const v = getOption(item, "代入先変数")?.value;
    if (f && v && typeof f === "string" && typeof v === "string") {
        const evaled = await runtime.eval(f);
        logger.log(
            f,
            "->",
            evaled,
            "->",
            v
        );
        if (isVariableValue(evaled)) {
            runtime.setVariable(v, evaled)
            return;
        }
    }
    notImplement();
};


