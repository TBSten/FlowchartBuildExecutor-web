import { SymType } from "src/items/symTypes";
import actionCreatorFactory from "typescript-fsa";
import { Item, ItemId, OptionValue } from "./types";

const actionCreator = actionCreatorFactory("items");

export const setItem = actionCreator<{
    item: Item;
}>("set");
export const removeItem = actionCreator<{
    itemId: ItemId;
}>("remove");
export const exchangeItems = actionCreator<{
    itemId1: ItemId,
    itemId2: ItemId
}>("exchange");

export const setOption = actionCreator<{
    itemId: ItemId;
    name: string;
    value: OptionValue;
}>("options/set");

export const setItemType = actionCreator<{
    itemId: ItemId;
    newItemType: SymType;
}>("itemType/set");

export const loadItems = actionCreator<{
    items: Item[],
}>("load");
export const resetItems = actionCreator("reset")

