import { ItemId } from "src/redux/items/types";

export const itemBaseCreator = (
    itemId: ItemId,
    itemType: string,
    parentItemId: ItemId | null
) => ({
    itemId,
    itemType,
    childrenItemIds: [],
    parentItemId,
});
