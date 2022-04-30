import { setItem } from "src/redux/items/actions";
import { store } from "src/redux/store";
import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { flowCreatorWithChildren } from "../flow/creator";
import { SymCreator } from "../types";
import { makeItemId } from "../util";

export const switchSymCreator: SymCreator = (itemId, parentItemId) => {
    const flowId1 = makeItemId(`flow-id`);
    const flowId2 = makeItemId(`flow-id`);
    const flowId3 = makeItemId(`flow-id`);
    const flow1 = flowCreatorWithChildren(flowId1, [], itemId);
    const flow2 = flowCreatorWithChildren(flowId2, [], itemId);
    const flow3 = flowCreatorWithChildren(flowId3, [], itemId);
    flow1.tag = "1";
    flow2.tag = "2";
    flow3.tag = "その他";
    store.dispatch(setItem({ item: flow1 }));
    store.dispatch(setItem({ item: flow2 }));
    store.dispatch(setItem({ item: flow3 }));
    return {
        ...itemBaseCreator(itemId, "switch", parentItemId),
        childrenItemIds: [flowId1, flowId2, flowId3],
        options: [
            optionCreator("条件", "変数", { type: "formula" }),
        ],
    }
};

