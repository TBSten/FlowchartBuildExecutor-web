import { notImplementError } from "src/lib/error";
import { Item, ItemId } from "src/redux/items/types";
import { flowCreator } from "./flow/creator";
import { symTypes } from "./symTypes";



export function itemCreator(itemType:string,itemId:ItemId,parentItemId:ItemId|null):Item{
    if(itemType === "flow"){
        return flowCreator(itemId,parentItemId);
    }
    if(itemType in symTypes){
        const type = symTypes[itemType as (keyof typeof symTypes)]
        return type.creator(itemId,parentItemId);
    }
    throw notImplementError(`invalid item type <<${itemType}>>`);
}

