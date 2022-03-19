import { StoreState } from "../store";
import { isSym, ItemId } from "./types";


export const getItem = (itemId: ItemId) => {
    return (state: StoreState) => state.items.find(item => item.itemId === itemId);
};

export const getItems = (...itemIds: ItemId[]) => {
    return (state: StoreState) => state.items.filter(item => itemIds.includes(item.itemId));
};

export const getAllItems = () => (state: StoreState) => state.items;

export const getOption = (itemId: ItemId, name: string) => {
    return (state: StoreState) => {
        const item = state.items.find(item => item.itemId === itemId);
        if (isSym(item)) {
            return item.options.find(o => o.name === name);
        }
        return;
    };
};

