
import { VariableValue } from "src/execute/eval";
import { notImplement } from "src/lib/notImplement";
import { getOption } from "../option";
import { ItemExecute } from "../types";

export const inputExecute: ItemExecute = async ({
    item,
    runtime,
}) => {
    const v = getOption(item, "入力先変数")?.value;
    const isNumber = getOption(item, "数字で入力")?.value;
    if (typeof v === "string" && typeof isNumber === "boolean") {
        let inputValue: VariableValue = await runtime.input();
        if (isNumber) {
            inputValue = parseFloat(inputValue)
            if (!isNaN(inputValue) && inputValue !== 0 && typeof inputValue !== "number" && typeof inputValue !== "bigint") {
                notImplement();
            }
        }
        runtime.setVariable(v, inputValue);
        return;
    }
    notImplement();
};


