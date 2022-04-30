import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { SymCreator } from "../types";

export const outputSymCreator: SymCreator = (itemId, parentItemId) => ({
    ...itemBaseCreator(itemId, "output", parentItemId),
    options: [
        optionCreator("表示対象", "0", { type: "formula" }),
    ],
});

