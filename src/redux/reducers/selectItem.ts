import { useSelector } from "react-redux";
import { Action } from "redux/types/action";
import {actionTypes} from "../actions" ;

const init = {
    id:"none",
} ;
export default function selectItemReducer(state=init, action:{type :string, payload:any}){
    const newState = Object.assign({},state);
    switch(action.type){
        case actionTypes.selectItem.select:
            const id = action.payload ;
            newState.id = id ;
            break;
    }
    return newState ;
}
export function useSelectItemId(){
    const selectItem = useSelector((state:{selectItem:{id: string}}) => state.selectItem.id);
    return selectItem ;
}
export function selectItemById(id :string) :Action{
    return {
        type:actionTypes.selectItem.select ,
        payload:id ,
    } ;
}




