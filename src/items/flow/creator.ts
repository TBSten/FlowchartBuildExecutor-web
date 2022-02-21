import { Flow, ItemId } from "src/redux/items/types";
import { itemBaseCreator } from "../base/itemBaseCreator";
import { FlowCreator } from "../types";

export const flowCreator: FlowCreator = (itemId, parentItemId) => ({
    ...itemBaseCreator(itemId, "flow", parentItemId),
    tag: "none",
});

export const flowCreatorWithChildren = (
    itemId: ItemId,
    children: ItemId[],
    parentItemId: ItemId | null
): Flow => {
    return {
        ...itemBaseCreator(itemId, "flow", parentItemId),
        tag: "",
        childrenItemIds: children,
    };
};
