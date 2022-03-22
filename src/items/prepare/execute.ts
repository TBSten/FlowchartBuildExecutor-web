import { logger } from "src/lib/logger";
import { notImplement, notImplementError } from "src/lib/error";
import { isBooleanArray, isNumberArray, isStringArray, mustNumber, mustString } from "src/lib/typechecker";
import { getOption } from "../option";
import { ItemExecute } from "../types";

export const prepareExecute: ItemExecute = async ({
    item,
    runtime,
}) => {
    const name = getOption(item, "準備対象")?.value;
    const type = getOption(item, "種類")?.value;
    const firstOp = getOption(item, "初期値")?.value;
    const cntOp = getOption(item, "要素数")?.value;
    mustString(name);
    if (type === "1次元配列") {
        const first = await runtime.eval(firstOp as string)
        const cnt = await runtime.eval(cntOp as string);
        mustString(firstOp);
        mustString(cntOp);
        mustNumber(cnt);
        const arr = Array(cnt).fill(first);
        if (!isNumberArray(arr) && !isStringArray(arr) && !isBooleanArray(arr)) {
            throw notImplementError();
        }
        await runtime.setVariable(name as string, Object.assign(arr, {}));
        return;
    }
    if (type === "2次元配列") {
        logger.log(cntOp)
        const cnts = cntOp?.toString().split("*");
        const first = await runtime.eval(firstOp as string);
        mustString(firstOp);
        logger.log(cnts)
        if (!cnts || cnts.length !== 2) throw notImplementError();
        const row = parseInt(cnts[0]);
        const col = parseInt(cnts[1]);
        logger.log(row, col);
        const arr = Array(row).fill(1).map(() => {
            const row = Array(col).fill(first);
            return row;
        });
        await runtime.setVariable(name as string, Object.assign(arr, {}));
        return;
    }

    notImplement();
};




