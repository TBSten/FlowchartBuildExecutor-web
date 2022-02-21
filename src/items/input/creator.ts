import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { SymCreator } from "../types";

export const inputSymCreator: SymCreator = (itemId, parentItemId) => ({
    ...itemBaseCreator(itemId, "input", parentItemId),
    options: [
        optionCreator("入力先変数", "入力値"),
        optionCreator("数字で入力", true, { type: "checkbox" }),
    ],
});

