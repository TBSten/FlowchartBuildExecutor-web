import { useDispatch } from "react-redux";
import { useChange } from "../app/hooks";
import { exchangeItems, removeItem, setItem, setOption } from "./actions";
import { getItem, getItems, getOption, } from "./selectors";
import { isFlow, isSym, Item, ItemId, OptionValue } from "./types";
import { useAppSelector } from "src/redux/root/hooks";

export function useItem(itemId: ItemId) {
    const item = useAppSelector(getItem(itemId));
    const { notifyChange } = useChange();
    const { setItem, removeItem } = useItemOperations();
    const set = (item: Item) => {
        setItem(item);
        notifyChange();
    };
    const remove = () => {
        removeItem(itemId);
        notifyChange();
    }
    return [item, { set, remove }] as const;
}

export function useItemOperations() {
    const dispatch = useDispatch();
    const { notifyChange } = useChange();
    const set = (item: Item) => {
        dispatch(setItem({ item }));
        notifyChange();
    };
    const remove = (itemId: ItemId) => {
        dispatch(removeItem({ itemId }))
        notifyChange();
    };
    const exchange = (itemId1: ItemId, itemId2: ItemId) => {
        dispatch(exchangeItems({
            itemId1,
            itemId2,
        }));
        notifyChange();
    }
    const _setOption = (itemId: ItemId, name: string, value: OptionValue) => {
        dispatch(setOption({
            itemId,
            name,
            value,
        }));
        notifyChange();
    };
    return {
        setItem: set,
        removeItem: remove,
        setOption: _setOption,
        exchangeItems: exchange,
    };
}

export function useItems(...itemIds: ItemId[]) {
    const items = useAppSelector(getItems(...itemIds));
    return items;
}

export function useSym(itemId: ItemId) {
    const [item, ...other] = useItem(itemId);
    if (isSym(item)) {
        return [item, ...other] as const;
    }
    throw new Error(`${itemId}は記号ではありません:${JSON.stringify(item)}`);
}

export function useFlow(itemId: ItemId) {
    const [item, ...other] = useItem(itemId);
    if (isFlow(item)) {
        return [item, ...other] as const;
    }
    throw new Error(`${itemId}はフローではありません:${JSON.stringify(item)}`);
}



export function useOption(itemId: ItemId, name: string) {
    const option = useAppSelector(getOption(itemId, name));
    const dispatch = useDispatch();
    const set = (value: OptionValue) => {
        dispatch(setOption({
            itemId,
            name,
            value,
        }))
    };
    return [option, set] as const;
}




