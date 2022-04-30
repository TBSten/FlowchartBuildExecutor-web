import { loadItems } from "src/redux/items/actions";
import { ItemId } from "src/redux/items/types";
import { loadMeta } from "src/redux/meta/actions";
import { store } from "src/redux/store";
import { logger } from "./logger";



export function optimizeItems(){
    const {
        items:oldItems,
        meta:oldMeta,
    } = store.getState();
    const {flowIds} = oldMeta ;
    function getItem(itemId:ItemId){
        return oldItems.find(item=>item.itemId === itemId)
    }

    const deps :ItemId[] = [];
    function addDep(itemId:ItemId){
        deps.push(itemId);
        const item = getItem(itemId)
        item?.childrenItemIds.forEach(itemId=>{
            addDep(itemId);
        })
    }

    flowIds.forEach(addDep)

    logger.log("optimized",deps,"from",oldItems)
    const items = [...oldItems]
        .filter( item => deps.includes(item.itemId) )

    store.dispatch(loadItems({items}));
}

export function optimize(){
    optimizeItems();
}
