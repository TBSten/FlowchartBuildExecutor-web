import { isVariableValue, VariableValue } from "src/execute/eval";
import { notImplement } from "src/lib/error";
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
            await runtime.output(format(data));
            return;
        }
    }
    notImplement();
};

function format(value: VariableValue): string {
    if (value instanceof Array) {
        const arr = value.map(v => format(v));
        const ans = `[ ${arr.join(" , ")} ]`;
        return ans;
    }
    if (typeof value === "string") {
        return `"${value}"`
    }
    return String(value)
}



