import { useSelector } from "react-redux";
import { Action } from "redux/types/action";
import {actionTypes} from "../actions" ;

const init = {
    id:"none",
    ids:[] as string[],
    multiSelect: false ,

} ;
export default function selectItemReducer(state=init, action:{type :string, payload:any}){
    const newState = Object.assign({},state);
    if(action.type === actionTypes.selectItem.select){
        let id = action.payload ;
        newState.id = id ;
        if(id === "none"){
            newState.ids = [];
        }else{
            newState.ids.push(id);
        }
    }else if(action.type === actionTypes.selectItem.unselect){
        let id = action.payload ;
        const idx = newState.ids.indexOf(id) -1;
        if(newState.id === id){
            newState.ids = newState.ids.filter(ele=>(
                ele !== id
            ));
            newState.id = newState.ids[idx] ;
        }else{
            newState.id = "none" ;
        }
    }else if(action.type === actionTypes.selectItem.toggleMulti){
        const value = action.payload ? true : false ;
        newState.multiSelect = value ;
    }
    // console.log("selectItem",newState);
    return newState ;
}
export function useSelectItemId(){
    const selectItem = useSelector((state:{selectItem:{id: string}}) => state.selectItem.id);
    return selectItem ;
}
export function useSelectItemIds() :string[]{
    const selectItemIds = useSelector((state:{selectItem:{ids: string[]}}) => state.selectItem.ids);
    return selectItemIds ;
}
export function selectItemById(id :string) :Action{
    return {
        type:actionTypes.selectItem.select ,
        payload:id ,
    } ;
}
export function unselectItemById(id :string) :Action{
    return {
        type:actionTypes.selectItem.unselect ,
        payload:id ,
    } ;
}




