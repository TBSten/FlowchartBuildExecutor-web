
import { isPureVariableValue, isVariableValue } from "src/execute/eval";
import { Runtime } from "src/execute/runtime/Runtime";
import { logger } from "src/lib/logger";
import { notImplement, notImplementError } from "src/lib/error";
import { mustString } from "src/lib/typechecker";
import { Item, ItemId } from "src/redux/items/types";
import { getOption } from "../option";
import { ItemExecute } from "../types";



/*
role    temp                    client
------------------------------------------------
(prev)  undefined 又は FIRST    none

first   
check   
loop    

plus    
check   
loop    
plus    
check   
loop    
plus    
check   

*/

/*
const variable = getOption(item, "ループ変数")?.value;
const init = getOption(item, "初期値")?.value;
const con = getOption(item, "条件")?.value;
const plus = getOption(item, "増分")?.value;

 */

export const forExecute: ItemExecute = async ({
    item,
    runtime,
}) => {
    const tempKey = `${item.itemId}/flg`;
    const flg = runtime.getTempData(tempKey) ?? "FIRST";
    logger.log("$ for flg", flg)
    if (flg === "FIRST") {
        await first(item, runtime);
        const loop = await check(item, runtime);
        if (loop) {
            await children(item, runtime);
            runtime.setTempData(tempKey, "LOOPING");
        } else {
            //ループを抜ける
            runtime.setTempData(tempKey, "FIRST");
        }
    } else if (flg === "LOOPING") {
        await plus(item, runtime);
        const loop = await check(item, runtime);
        if (loop) {
            await children(item, runtime);
            runtime.setTempData(tempKey, "LOOPING");
        } else {
            //ループを抜ける
            runtime.setTempData(tempKey, "FIRST");
        }

    } else {
        notImplement();
    }
};

async function first(item: Item, runtime: Runtime) {
    const variable = getOption(item, "ループ変数")?.value;
    const initOp = getOption(item, "初期値")?.value;
    const init = await runtime.eval(mustString(initOp));
    if (!isVariableValue(init)) throw notImplementError();
    await runtime.setVariable(mustString(variable), init);
}
async function check(item: Item, runtime: Runtime): Promise<boolean> {
    const conOp = getOption(item, "条件")?.value;
    const con = await runtime.eval(mustString(conOp));
    if (typeof con === "boolean") {
        return con;
    } else {
        logger.error("con", con);
        throw notImplementError(`invalid condition : ${con}`);
    }
}
async function children(item: Item, runtime: Runtime) {
    const children = item.childrenItemIds;
    runtime.executingItemIds = [
        ...children,
        item.itemId,
        ...runtime.executingItemIds,
    ];
}
async function plus(item: Item, runtime: Runtime) {
    const variable = getOption(item, "ループ変数")?.value;
    const plus = getOption(item, "増分")?.value;
    const evaled = await runtime.eval(`${mustString(variable)}+(${mustString(plus)})`);
    if (!isVariableValue(evaled)) throw notImplementError(`invalid evaled value : ${evaled} `);
    if (!isPureVariableValue(evaled)) throw notImplementError(`evaled value invalid : ${evaled}`);
    await runtime.assignVariable(
        mustString(variable),
        evaled,
    );
}

