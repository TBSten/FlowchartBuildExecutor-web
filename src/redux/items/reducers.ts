import { reducerWithInitialState } from "typescript-fsa-reducers";
import { isFlow, isSym, Items, Option, Sym } from "./types";
import * as actions from "./actions";

export const init: Items = [];

export const items = reducerWithInitialState(init)
    .case(actions.setItem, (state, payload) => {
        const newItemId = payload.item.itemId;
        const newItem = payload.item;
        let updateFlg = false;
        //更新
        let newState: Items = state.map((item) => {
            if (item.itemId === newItemId) {
                updateFlg = true;
                return newItem;
            }
            return item;
        });
        if (!updateFlg) {
            //追加
            newState = [...newState, newItem];
        }
        return newState;
    })
    .case(actions.removeItem, (state, payload) => {
        const targetId = payload.itemId;
        //アイテム一覧から削除
        let newState = state.filter((item) => item.itemId !== targetId);
        //フローのchildrenItemIdsから削除
        newState = newState.map((item) => {
            if (isFlow(item) && item.childrenItemIds.includes(targetId)) {
                return {
                    ...item,
                    childrenItemIds: item.childrenItemIds.filter(
                        (id) => id !== targetId
                    ),
                };
            }
            return item;
        });
        return newState;
    })
    .case(actions.setOption, (state, payload) => {
        const targetId = payload.itemId;
        const targetName = payload.name;
        const targetValue = payload.value;
        const newState = state.map((item) => {
            if (item.itemId !== targetId) return item;
            if (!isSym(item)) return item;
            const newOptions: Option[] = item.options.map((option) => {
                if (option.name !== targetName) return option;
                return {
                    ...option,
                    value: targetValue,
                };
            });
            const newItem: Sym = {
                ...item,
                options: newOptions,
            };
            return newItem;
        });
        return newState;
    })
    .case(actions.loadItems, (state, payload) => {
        return payload.items;
    })
    .case(actions.resetItems, () => {
        return init ;
    })

