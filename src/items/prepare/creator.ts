import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { SymCreator } from "../types";

export const prepareSymCreator: SymCreator = (itemId, parentItemId) => ({
    ...itemBaseCreator(itemId, "prepare", parentItemId),
    options: [
        optionCreator("準備対象", "arr", { type: "variableName" }),
        optionCreator("種類", "1次元配列", { type: "select", inputArgs: ["1次元配列", "2次元配列"] }),
        optionCreator("初期値", "0", { type: "formula" }),
        optionCreator("要素数", "10", { type: "text" }),
        optionCreator("簡易表示", false, { type: "checkbox" }),
    ],
});

