import { SymType } from "src/items/symTypes";
import actionCreatorFactory from "typescript-fsa";
import { Item, ItemId, OptionValue } from "./types";

const actionCreator = actionCreatorFactory();

export const setItem = actionCreator<{
    item: Item;
}>("items/set");
export const removeItem = actionCreator<{
    itemId: ItemId;
}>("items/remove");
export const exchangeItems = actionCreator<{
    itemId1: ItemId,
    itemId2: ItemId
}>("items/exchange");
export const setOption = actionCreator<{
    itemId: ItemId;
    name: string;
    value: OptionValue;
}>("items/options/set");
export const setItemType = actionCreator<{
    itemId: ItemId;
    newItemType: SymType;
}>("items/itemType/set");

export const loadItems = actionCreator<{
    items: Item[],
}>("items/load");
export const resetItems = actionCreator("items/reset")
