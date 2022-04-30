import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { SymCreator } from "../types";

export const processSymCreator: SymCreator = (itemId, parentItemId) => ({
    ...itemBaseCreator(itemId, "process", parentItemId),
    options: [
        optionCreator("処理名", "並べ替え", { type: "text" }),
    ],
});

