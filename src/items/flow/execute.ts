
import { isFlow } from "src/redux/items/types";
import { ItemExecute } from "../types";

export const flowExecute :ItemExecute = async ({
    item,
    runtime,
})=>{
    // console.log("flow execute",item,runtime);
    const flow = runtime.items.find(_i=>_i.itemId === item.itemId) ;
    if(isFlow(flow)){
        const childrenIds = flow.childrenItemIds ;
        const executingItemIds = [
            ...childrenIds,
            ...runtime.executingItemIds,
        ] ;
        runtime.executingItemIds = executingItemIds ;
        runtime.flush();
        // runtime.executeNext();
        return {
            skip: true,
        } ;
    }
    throw new Error(`${flow} is not flow`) ;
} ;
