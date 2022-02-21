import { isVariableValue } from "src/execute/eval";
import { notImplement } from "src/lib/notImplement";
import { getOption } from "../option";
import { ItemExecute } from "../types";

export const outputExecute: ItemExecute = async ({
    item,
    runtime,
}) => {
    const f = getOption(item, "表示対象")?.value;
    if (typeof f === "string") {
        const data = await runtime.eval(f);
        if (isVariableValue(data)) {
            await runtime. output(String(data));
            return;
        }
    }
    notImplement();
};




