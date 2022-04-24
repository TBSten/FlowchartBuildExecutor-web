import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { SymCreator } from "../types";

export const terminalEndSymCreator: SymCreator = (itemId, parentItemId) => {
    const ans = ({
        ...itemBaseCreator(itemId, "terminal-end", parentItemId),
        options: [
            optionCreator("戻り値を返す", false, { type: "checkbox" }),
            optionCreator("戻り値", ""),
        ],
    })
    ans.flgs.delete = false;
    return ans ;
};

