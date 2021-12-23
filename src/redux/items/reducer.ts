
import { Items } from "redux/types/item";
import { actionTypes } from "./actions" ; 
import { init } from "./initialState";

export default function itemsReducer(
    state :Items =init, 
    action:{type :string, payload:any}){
        let newState :Items = {...state};

        if(action.type === actionTypes.add){
            const newItem = action.payload ;
            // console.log("add !",action.payload);
            const idx = "Item-"+Object.keys(newState).length+"-"+Math.floor(Math.random()*1000) ;
            newState[idx] = newItem ;
        }else if(action.type === actionTypes.set){
            const id = action.payload.id ;
            const item = action.payload.item ;
            newState[id] = item ;
        }else if(action.type === actionTypes.remove){
            const id = action.payload ;
            newState = Object.keys(newState).reduce((p,v)=>{
                if(v !== id){
                    p[v] = newState[v] ;
                }
                return p ;
            },{} as Items);
        }else if(action.type === actionTypes.option.set){
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
        }else if(action.type === actionTypes.sym.add){
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
        }else if(action.type === actionTypes.sym.remove){
            const parentId = action.payload.parentId ;
            const childId = action.payload.childId ;
            const newParentItem = Object.assign({},newState[parentId]) ;
            newParentItem.syms = newParentItem.syms?.filter(ele=>(
                ele !== childId 
            ));
            newState[parentId] = newParentItem ;
        }else if(action.type === actionTypes.load){
            const items = action.payload ;
            newState = {...init,...items} ;
        }else if(action.type === actionTypes.exchange){
            const itemId1 = action.payload.itemId1 ;
            const itemId2 = action.payload.itemId2 ;
            const item1 = newState[itemId1];
            const item2 = newState[itemId2];
            if(itemId1 && itemId2){
                Object.keys(newState).forEach(itemId=>{
                    //itemIdのアイテムについて
                    //アイテム自体の入れ替えチェック
                    if(itemId === itemId1){
                        newState[itemId1] = item2 ;
                    }
                    if(itemId === itemId2){
                        newState[itemId2] = item1 ;
                    }
                    //アイテムの子要素の入れ替えチェック
                    const item = newState[itemId] ;
                    if(item && item.syms){
                        for(let idx = 0 ; idx < item.syms.length;idx++){
                            const symId = item.syms[idx] ;
                            if(symId === itemId1){
                                item.syms[idx] = itemId2;
                            }
                            if(symId === itemId1){
                                item.syms[idx] = itemId1;
                            }
                        }
                    }
                });
            }else{
                //エラー
            }
        }
        return newState ;
}
