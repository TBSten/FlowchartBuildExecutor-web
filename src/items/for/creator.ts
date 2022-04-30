import { setItem } from "src/redux/items/actions";
import { store } from "src/redux/store";
import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { flowCreatorWithChildren } from "../flow/creator";
import { SymCreator } from "../types";
import { makeItemId } from "../util";

export const forSymCreator: SymCreator = (itemId, parentItemId) => {
    const flowId = makeItemId(`flow`);
    const flow = flowCreatorWithChildren(flowId, [], itemId);
    store.dispatch(setItem({ item: flow }));
    return {
        ...itemBaseCreator(itemId, "for", parentItemId),
        childrenItemIds: [flowId],
        options: [
            optionCreator("ループ変数", "i", { type: "variableName" }),
            optionCreator("初期値", "0", { type: "formula" }),
            optionCreator("条件", "i < 5", { type: "formula" }),
            optionCreator("増分", "1", { type: "formula" }),
        ],
    }
};
