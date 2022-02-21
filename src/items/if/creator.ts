import { setItem } from "src/redux/items/actions";
import { store } from "src/redux/store";
import { itemBaseCreator } from "../base/itemBaseCreator";
import optionCreator from "../base/optionCreator";
import { flowCreatorWithChildren } from "../flow/creator";
import { SymCreator } from "../types";
import { makeItemId } from "../util";

export const ifSymCreator: SymCreator = (itemId,parentItemId) => {
    const yesFlowId = makeItemId() ;
    const noFlowId = makeItemId() ;
    const yesFlow = flowCreatorWithChildren(yesFlowId,[],itemId);
    const noFlow = flowCreatorWithChildren(noFlowId,[],itemId);

    store.dispatch(setItem({item:yesFlow}));
    store.dispatch(setItem({item:noFlow}));
    return {
        ...itemBaseCreator(itemId,"if",parentItemId),
        childrenItemIds: [
            yesFlowId,
            noFlowId,
        ],
        options: [optionCreator("条件", "変数 < 5")],
    };
};




