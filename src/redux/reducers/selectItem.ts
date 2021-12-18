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
        const isInclude = newState.ids.includes(id) ;
        //newState.idを操作
        if(newState.multiSelect){
            //複数選択
            if(id === "none"){
                //選択解除
                newState.id = "none" ;
                newState.ids = [] ;
            }else if(isInclude){
                newState.ids = newState.ids.filter(ele=>(
                    ele !== id
                ));
                if(newState.id === id){
                }else{
                    newState.id = newState.ids[newState.ids.length-1] ;
                }
            }else{
                //新規追加
                newState.id = id ;
                newState.ids.push(id);
            }
        }else{
            //単数選択
            if(newState.id === id){
                newState.id = "none" ;
                newState.ids = [] ;
            }else{
                newState.id = id ;
                newState.ids = [id] ;
            }
        }
    }else if(action.type === actionTypes.selectItem.unselect){
        let id = action.payload ;
        const idx = newState.ids.indexOf(id) -1;
        if(newState.id === id){
            console.log("new id :",newState.ids[idx],idx);
            newState.id = newState.ids[idx] ;
        }
        newState.ids = newState.ids.filter(ele=>(
            ele !== id
        ));
        }else if(action.type === actionTypes.selectItem.toggleMulti){
        const value = action.payload ? true : false ;
        newState.multiSelect = value ;
        if(!value){
            newState.ids = [newState.id] ;
        }
    }
    // console.log("selectItem",newState);
    return newState ;
}

//hooks
export function useSelectItemId(){
    const selectItem = useSelector((state:{selectItem:{id: string}}) => state.selectItem.id);
    return selectItem ;
    // const selectItemIds = useSelector((state:{selectItem:{ids: string[]}}) => state.selectItem.ids);
    // return selectItemIds[selectItemIds.length-1] ;
}
export function useSelectItemIds() :string[]{
    const selectItemIds = useSelector((state:{selectItem:{ids: string[]}}) => state.selectItem.ids);
    return selectItemIds ;
}
export function useMultiSelect() :boolean{
    const multiSelect = useSelector((state:{selectItem:{multiSelect: boolean}}) => state.selectItem.multiSelect);
    return multiSelect ;
}


//actions
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
export function toggleMulti(value :boolean) :Action{
    return {
        type:actionTypes.selectItem.toggleMulti ,
        payload:value ,
    } ;
}




