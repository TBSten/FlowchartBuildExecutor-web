import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { selectItemState, modeState } from "./edit";
import { calcSymCreator, flowCreator, whileSymCreator } from "util/itemCreator";
import { OptionType } from "../util/syms";

import { createStore } from "redux";

export interface Option<V> {
  name: string;
  value: V;
  type: OptionType; //optionType のキーのみ
  args?: any;
}
export interface Item {
  component: any;
  syms?: number[];
  options: Option<any>[];
}

export const topFlowsState = atom({
    key:"topFlows",
    default:[3],
});

const itemListState = atom<number[]>({
    key: "itemList",
    default: [0,1,2,3,4,5],
});
const itemDataState = atom<Item[]>({
    key: "itemData",
    default: [
        calcSymCreator(),
        calcSymCreator(),
        calcSymCreator(),
        flowCreator([0,1,2,4]),
        whileSymCreator([5]),
        calcSymCreator(),

    ],
});
const itemsState = selector<Item[]>({
    key: "item",
    get: ({get})=>{
        console.log("itemListState", get(itemListState));
        console.log("itemDataState", get(itemDataState));
        const ans :Item[] = get(itemListState).map(ele=>{
            return get(itemDataState)[ele] ;
        }) ;
        return ans ;
    }
});



export function useEditItems() {
    const [itemList,setItemList] = useRecoilState(itemListState);
    const [itemData,setItemData] = useRecoilState(itemDataState);
    const [selectItemId,setSelectItemId] = useRecoilState(selectItemState);
    const mode = useRecoilValue(modeState);
    const items = useRecoilValue(itemsState);
    const topFlows = useRecoilValue(topFlowsState);

    function getItem(itemId :number) :Item{
        return itemData[itemId] ;
    }
    function addItem(item :Item){
        const newItemData = [
            ...itemData,
            item
        ] ;
        const idx = newItemData.indexOf(item) ;
        setItemData(newItemData);
        const newItemList = [
            ...itemList,
            idx,
        ] ;
        setItemList(newItemList);
        console.log("addItem item:",
            item,
            newItemData,newItemList,
            itemData,itemList,);
        return idx ;
    }
    function setItem(itemId :number, newItem :Item){
        const newItemData = itemData.map((ele,idx)=>{
            if(idx === itemId){
                return newItem ;
            }
            return ele ;
        });
        setItemData(newItemData);
    }
    function removeItem(itemId :number){
        const newItemList = itemList.filter((ele,idx)=>(idx!==itemId));
        setItemList(newItemList);
    }
    function setOption(itemId :number, name :string, value :string|number){
        const newItemData = itemData.map((ele :Item,idx)=>{
            //変更対象のItem
            if(idx === itemId){
                //eleのoptionを書き換え
                const newOptions = ele.options.map((op)=>{
                    //変更対象のOption
                    if(op.name === name){
                        return {
                            ...op,
                            value,} ;
                    }
                    return op ;
                }) ;
                const newItem :Item = {
                    ...ele,
                    options:newOptions,
                } ;
                return newItem ;
            }
            return ele ;
        });
        setItemData(newItemData);
    }
    function selectItem(itemId :number){
        setSelectItemId(itemId);
    }
    function addSymToFlow(flowId :number,idx :number, symId :number){
        const oldFlow = getItem(flowId);
        const newSyms :number[] | undefined = oldFlow.syms?.reduce((p,v,i) :number[]=>{
            if(idx === i){
                p.push(symId);
            }
            p.push(v);
            return p ;
        },[] as number[]);
        const newFlow = {...oldFlow, syms:newSyms} ;
        setItem(flowId,newFlow);
        console.log(newFlow);
    }



    return {
        items,
        getItem,
        addItem,
        setItem,
        removeItem,
        setOption,
        topFlows,
        selectItem,
        selectItemId,
        mode,
        addSymToFlow,
    };
}

/*
//item
itemList :[0,1,3]
itemData :[
    Item{},  
    Item{},  
    Item{},  //削除済み
    Item{},  
]
追加(item :Item)
    itemData.push(item);
    itemList.push(itemData.length);
更新(id :number, item :Item)
    itemData[id] = item ;
削除(id :number)
    itemList.remove(id);

 */
