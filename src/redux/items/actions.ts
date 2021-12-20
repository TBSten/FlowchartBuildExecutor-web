import { Item, Items } from "redux/types/item";

export const actionTypes = {
    add:"items/add",
	set:"items/set",
	remove:"items/remove",
	option:{
		set:"items/option/set",
	},
	sym:{
		add:"items/sym/add",
		remove:"items/sym/remove",
	},
	load:"items/load",
	exchange:"items/exchange",

} ;

//actionCreators
export function addItem(item :Item) {
    return {
        type:actionTypes.add,
        payload:item,
    } ;
}
export function setItem(id :string, item :Item) {
    return {
        type:actionTypes.set,
        payload:{
            id,
            item,
        },
    } ;
}
export function removeItem(id :string) {
    return {
        type:actionTypes.remove ,
        payload:id ,
    } ;
}
export function setOption(id :string, name :string, value: string|number|boolean){
    return {
        type:actionTypes.option.set ,
        payload:{
            id,
            name,
            value
        },
    } ;
}
export function loadItems(items :Items){
    return {
        type:actionTypes.load,
        payload:items,
    } ;
}
export function exchangeItem(itemId1:string, itemId2:string){
    return {
        type:actionTypes.exchange,
        payload:{
            itemId1,
            itemId2
        }
    } ;
}


