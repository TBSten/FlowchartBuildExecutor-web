import { setItem } from "src/redux/items/actions";
import { store } from "src/redux/store";
import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { flowCreator } from "../flow/creator";
import { SymCreator } from "../types";
import { makeItemId } from "../util";

export const whileSymCreator: SymCreator = (itemId, parentItemId) => {
    const flowId = makeItemId("flow-id");
    const flow = flowCreator(flowId, itemId);
    store.dispatch(setItem({ item: flow }));
    return {
        ...itemBaseCreator(itemId, "while", parentItemId),
        childrenItemIds: [flowId],
        options: [
            optionCreator("ループ条件", "変数 < 5"),
            optionCreator("判定タイミング", "前判定", { type: "select", inputArgs: ["前判定", "後判定"] }),
        ],
    };
};
