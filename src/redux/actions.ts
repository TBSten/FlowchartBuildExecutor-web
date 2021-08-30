import { Action } from "./types/action";
import { Item } from "redux/types/item";

//actionTypes
const items = {
    add:"items/add",
    set:"items/set",
    remove:"items/remove",
    option:{
        set:"items/option/set",
    },
} ;
const top = {
    flow:{
        add:"top/flows/add",
        remove:"top/flows/remove",
    },
} ;
const selectItem = {
    select:"selectItem/select",
} ;
const mode={
    set:"mode/set",
} ;

export const actionTypes = {
    items,
    top,
    selectItem,
    mode,
} ;

//actionCreator
function addItem(item :Item):Action{
    return {
        type:items.add,
        payload:item,
    } ;
}

export const actionCreators = {
    addItem,
} ;


