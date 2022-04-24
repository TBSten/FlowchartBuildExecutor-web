import { ItemId } from "src/redux/items/types";

export const itemBaseCreator = (
    itemId: ItemId,
    itemType: string,
    parentItemId: ItemId | null
) => {
    return {
        itemId,
        itemType,
        childrenItemIds: [],
        parentItemId,
        flgs:{
            "delete":true,
        }
    }
};
