import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { SymCreator } from "../types";

export const calcSymCreator: SymCreator = (itemId, parentItemId) => ({
    ...itemBaseCreator(itemId, "calc", parentItemId),
    options: [
        optionCreator("式", "0"),
        optionCreator("代入先変数", "合計"),
    ],
});
