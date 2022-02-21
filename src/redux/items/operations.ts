import { useDispatch, useSelector } from "react-redux";
import { removeItem, setItem, setOption } from "./actions";
import { getItem, getItems, getOption, } from "./selectors";
import { isFlow, isSym, Item, ItemId, OptionValue } from "./types";

export function useItem(itemId:ItemId) {
    const item = useSelector(getItem(itemId)) ;
    const dispatch = useDispatch() ;

    const set = (item:Item)=>{
        dispatch(setItem({item}));
    } ;
    const remove = ()=>{
        dispatch(removeItem({itemId})) ;
    } ;
    return [item,{set,remove}] as const ;
}

export function useItemOperations(){
    const dispatch = useDispatch() ;
    const set = (item:Item)=>{
        dispatch(setItem({item}));
    } ;
    const remove = (itemId:ItemId)=>{
        dispatch(removeItem({itemId}))
    } ;
    const _setOption = (itemId:ItemId,name:string,value:OptionValue)=>{
        dispatch(setOption({
            itemId,
            name,
            value,
        }));
    } ;
    return {
        setItem:set,
        removeItem:remove,
        setOption:_setOption,
    } ;
}

export function useItems(...itemIds:ItemId[]) {
    const items = useSelector(getItems(...itemIds)) ;
    return items ;
}

export function useSym(itemId:ItemId){
    const [item,...other] = useItem(itemId);
    if(isSym(item)){
        return [item,...other] as const ;
    }
    throw new Error(`${itemId}は記号ではありません:${JSON.stringify(item)}`) ;
}

export function useFlow(itemId:ItemId){
    const [item,...other] = useItem(itemId);
    if(isFlow(item)){
        return [item,...other] as const ;
    }
    throw new Error(`${itemId}はフローではありません:${JSON.stringify(item)}`) ;
}



export function useOption(itemId:ItemId,name:string){
    const option = useSelector(getOption(itemId,name)) ;
    const dispatch = useDispatch() ;
    const set = (value:OptionValue)=>{
        dispatch(setOption({
            itemId,
            name,
            value,
        }))
    } ;
    return [option,set] ;
}




