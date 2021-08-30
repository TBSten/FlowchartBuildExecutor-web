import {calcSymCreator, flowCreator, whileSymCreator} from "../../util/itemCreator" ; 
import {actionTypes} from "../actions" ;

import { Items } from "redux/types/item";



const init = {
    "Item-0":flowCreator(["Item-1","Item-2","Item-3"]),
    "Item-1":calcSymCreator(),
    "Item-2":calcSymCreator(),
    "Item-3":calcSymCreator(),
    "Item-4":whileSymCreator([]),
    "Item-5":flowCreator(["Item-6","Item-7"]),
    "Item-6":calcSymCreator(),
    "Item-7":calcSymCreator(),
} ;
export default function itemsReducer(
    state :Items =init, 
    action:{type :string, payload:any}){
        const newState = Object.assign({},state);
        switch(action.type){
            case actionTypes.items.add:
                console.log("add !",action.payload);
                const idx = "Item-"+newState.length+"-"+Math.floor(Math.random()*1000) ;
                newState[idx] = action.payload ;
                break;
            case actionTypes.items.set:
                break;
            case actionTypes.items.remove:
                break;
            case actionTypes.items.option.set:
                break;
        }
        return newState ;
}

