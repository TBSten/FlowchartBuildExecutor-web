// import {calcSymCreator, doubleBranchSymCreator, flowCreator, terminalSymCreator, whileSymCreator} from "../../util/itemCreator" ; 

import { Item, Items, Option } from "redux/types/item";
import { useSelector } from "react-redux";
import { Action } from "redux/types/action";
import { actionTypes } from "redux/actions" ; 



const init = {
} ;
export default function itemsReducer(
    state :Items =init, 
    action:{type :string, payload:any}){
        let newState :Items = Object.assign({},state);
        if(action.type === actionTypes.items.add){
            const newItem = action.payload ;
            // console.log("add !",action.payload);
            const idx = "Item-"+Object.keys(newState).length+"-"+Math.floor(Math.random()*1000) ;
            newState[idx] = newItem ;
        }else if(action.type === actionTypes.items.set){
            const id = action.payload.id ;
            const item = action.payload.item ;
            newState[id] = item ;
        }else if(action.type === actionTypes.items.remove){
            const id = action.payload ;
            newState = Object.keys(newState).reduce((p,v)=>{
                if(v !== id){
                    p[v] = newState[v] ;
                }
                return p ;
            },{} as Items);
        }else if(action.type === actionTypes.items.option.set){
            const id = action.payload.id ;
            const name = action.payload.name ;
            const value = action.payload.value ;
            const newItem = Object.assign({},newState[id]) ;
            newItem.options = newItem.options.map(ele=>{
                const ans = Object.assign({},ele) ;
                if(ele.name === name){
                    // console.log(`${ele.name}: ${ele.value} => ${value}`);
                    ans.value = value ;
                }
                return ans ;
            });
            newState[id] = newItem ;
        }else if(action.type === actionTypes.items.sym.add){
            const parentId = action.payload.parentId ;
            const childId = action.payload.childId ;
            const idx = action.payload.idx ;
            const newParentItem = Object.assign({},newState[parentId]);
            newParentItem.syms = newParentItem?.syms?.reduce((p,v,i)=>{
                if(idx === i){
                    p.push(childId);
                }
                p.push(v);
                return p ;
            },[] as string[]);
            newState[parentId] = newParentItem ;
        }else if(action.type === actionTypes.items.sym.remove){
            const parentId = action.payload.parentId ;
            const childId = action.payload.childId ;
            const newParentItem = Object.assign({},newState[parentId]) ;
            newParentItem.syms = newParentItem.syms?.filter(ele=>(
                ele !== childId 
            ));
            newState[parentId] = newParentItem ;
        }else if(action.type === actionTypes.items.load){
            const items = action.payload ;
            newState = {...init,...items} ;
        }
        return newState ;
}

export function useItems(){
    const items = useSelector((state:{items:Items}) => state.items);
    return items ;
}
export function useGetItem(){
    const items = useItems() ;
    return function getItem(id :string){
        return items[id] ;
    };
}
export function useGetItemOption() :(id :string, name :string)=>Option<string>|null{
    const getItem = useGetItem() ;
    return function getItemOption(id :string, name :string) :Option<string>|null{
        const item = getItem(id) ;
        let ans = null ;
        item.options.forEach(ele=>{
            if(ele.name === name){
                ans = ele ;
            }
        });
        return ans ;
    }
}

//actionCreators
export function addItem(item :Item) :Action{
    return {
        type:actionTypes.items.add,
        payload:item,
    } ;
}
export function setItem(id :string, item :Item) :Action{
    return {
        type:actionTypes.items.set,
        payload:{
            id,
            item,
        },
    } ;
}
export function removeItem(id :string) :Action{
    return {
        type:actionTypes.items.remove ,
        payload:id ,
    } ;
}
export function setOption(id :string, name :string, value: string|number|boolean){
    return {
        type:actionTypes.items.option.set ,
        payload:{
            id,
            name,
            value
        },
    } ;
}
export function loadItems(items :Items){
    return {
        type:actionTypes.items.load,
        payload:items,
    } ;
}




