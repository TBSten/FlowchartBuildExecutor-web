import { isVariableValue } from "src/execute/eval";
import { notImplement } from "src/lib/notImplement";
import { getOption } from "../option";
import { ItemExecute } from "../types";

export const calcExecute: ItemExecute = async ({
    item,
    runtime,
}) => {
    // console.log("calc execute",item,runtime);
    const f = getOption(item, "式")?.value;
    const v = getOption(item, "代入先変数")?.value;
    if (f && v && typeof f === "string" && typeof v === "string") {
        const evaled = await runtime.eval(f);
        console.log(
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


