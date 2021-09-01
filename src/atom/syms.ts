import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { selectItemState, modeState } from "./edit";
// import { calcSymCreator, flowCreator, whileSymCreator } from "util/itemCreator";
import { OptionType } from "../util/syms";


export interface Option<V> {
  name: string;
  value: V;
  type: OptionType; //optionType のキーのみ
  args?: any;
}
export interface Item {
  component: any;
  syms?: string[];
  options: Option<any>[];
}

export const topFlowsState = atom({
    key:"topFlows",
    default:["Item-3"],
});

const itemListState = atom<string[]>({
    key: "itemList",
    default: [
        "Item-0",
        "Item-1",
        "Item-2",
        "Item-3",
        "Item-4",
        "Item-5",
        "Item-6",
    ],
});
const itemDataState = atom<{[key: string]: Item}>({
    key: "itemData",
    default: {
        // "Item-0": calcSymCreator(),
        // "Item-1": calcSymCreator(),
        // "Item-2": calcSymCreator(),
        // "Item-3": flowCreator(["Item-0","Item-1","Item-2","Item-4"]),
        // "Item-4": whileSymCreator(["Item-5"]),
        // "Item-5": flowCreator(["Item-6"]),
        // "Item-6": calcSymCreator(),
    }
});
const itemsState = selector<Item[]>({
    key: "items",
    get: ({get})=>{
        const ans :Item[] = get(itemListState).map(ele=>{
            return get(itemDataState)[ele] ;
        }) ;
        return ans ;
    },
});




export function useGetItem() {
    const itemList = useRecoilValue(itemListState);
    const itemData = useRecoilValue(itemDataState);
    function getItem(itemId :string):Item | null{
        if(itemList.indexOf(itemId) >= 0){
            return itemData[itemId] ;
        }else{
            return null ;
        }
    }
    return getItem ;
}
export function useAddItem(){
    const [itemList,setItemList] = useRecoilState(itemListState);
    const [itemData,setItemData] = useRecoilState(itemDataState);
    function addItem(item :Item){
        const idx :string = "Item-"+Object.keys(itemData).length+"-"+Math.floor(Math.random()*10000) ;
        const newItemData = {
            ...itemData,
            [idx]:item,
        }
        setItemData(newItemData);
        const newItemList = [
            ...itemList,
            idx,
        ] ;
        setItemList(newItemList);

        console.log("addItem :", idx, item);
        return idx ;
        // setItemList(itemList=>{
        //     const idx :string = "Item-"+Object.keys(itemData).length ;
        //     const newItemData = {
        //         ...itemData,
        //         [idx]:item,
        //     }
        //     setItemData(newItemData);
        //     const newItemList = [
        //         ...itemList,
        //         idx,
        //     ] ;
        //     // setItemList(newItemList);

        //     console.log("addItem :", idx, item);
        //     return newItemList ;
        // });
    }
    return addItem ;
}
export function useItems(){
    const items = useRecoilValue(itemsState);
    return items ;
}
export function useSetItem(){
    const setItemData = useSetRecoilState(itemDataState);
    function setItem(itemId :string, newItem :Item){
        setItemData(prev => {
            const newItemData = {...prev} ;
            newItemData[itemId] = newItem ;
            return newItemData ;
        });
    }
    return setItem ;
}
export function useRemoveItem(){
    const [itemList,setItemList] = useRecoilState(itemListState);
    function removeItem(itemId :string){
        setItemList(()=>{
            const newItemList = itemList.filter((ele)=>{
                return ele!==itemId
            }) ;
            return newItemList ;
        });
    }
    return removeItem ;
}
export function useSetOption(){
    const [itemData,setItemData] = useRecoilState(itemDataState);
    function setOption(itemId :string, name :string, value :string|number){
        const newItemData = {...itemData} ;
        const newItem = {...itemData[itemId]} ;
        newItem.options = newItem.options.map(ele=>{
            if(ele.name!==name){
                return ele ;
            }else{
                return {...ele, value:value} ;
            }
        });
        newItemData[itemId] = newItem;
        setItemData(newItemData);
        // console.log(itemId, name,value,"==>>",newItemData);
    }
    return setOption ;
}
export function useTopFlows(){
    const topFlows = useRecoilValue(topFlowsState);
    return topFlows ;
}
export function useSelectItem(){
    const setSelectItemId = useSetRecoilState(selectItemState);
    function selectItem(itemId :string){
        setSelectItemId(itemId);
    }
    return selectItem ;
}
export function useSelectItemId(){
    const selectItemId = useRecoilValue(selectItemState);
    return selectItemId ;
}
export function useMode(){
    const mode = useRecoilValue(modeState);
    return mode ;
}
export function useAddSymToFlow(){
    const getItem = useGetItem();
    const setItem = useSetItem();
    function addSymToFlow(flowId :string,idx :number, symId :string){
        const oldFlow = getItem(flowId);
        if(oldFlow){
            const newSyms :string[] | undefined = oldFlow.syms?.reduce((p,v,i) :string[]=>{
                if(idx === i){
                    p.push(symId);
                }
                p.push(v);
                return p ;
            },[] as string[]);
            if(oldFlow.syms && idx >= oldFlow.syms.length){
                newSyms?.push(symId);
            }
            const newFlow = {...oldFlow, syms:newSyms} ;
            setItem(flowId,newFlow);
        }
    }
    return addSymToFlow ;
}

export function useEditItems() {
    // const [itemList,setItemList] = useRecoilState(itemListState);
    // const [itemData,setItemData] = useRecoilState(itemDataState);
    // const [selectItemId,setSelectItemId] = useRecoilState(selectItemState);
    // const mode = useRecoilValue(modeState);
    // const items = useRecoilValue(itemsState);
    // const topFlows = useRecoilValue(topFlowsState);

    // function getItem(itemId :string) :Item | null{
    //     if(itemList.indexOf(itemId) >= 0){
    //         return itemData[itemId] ;
    //     }else{
    //         return null ;
    //     }
    // }
    // function addItem(item :Item){
    //     const idx :string = "Item-"+Object.keys(itemData).length ;
    //     const newItemData = {
    //         ...itemData,
    //         [idx]:item,
    //     }
    //     setItemData(newItemData);
    //     const newItemList = [
    //         ...itemList,
    //         idx,
    //     ] ;
    //     setItemList(newItemList);
    //     return idx ;

    // }
    // function setItem(itemId :string, newItem :Item){
    //     setItemData(prev => {
    //         const newItemData = {...prev} ;
    //         newItemData[itemId] = newItem ;
    //         return newItemData ;
    //     });
    // }
    // function removeItem(itemId :string){
    //     setItemList(()=>{
    //         const newItemList = itemList.filter((ele)=>{
    //             return ele!==itemId
    //         }) ;
    //         return newItemList ;
    //     });
    // }
    // function setOption(itemId :string, name :string, value :string|number){
    //     const newItemData = {...itemData} ;
    //     const newItem = {...itemData[itemId]} ;
    //     newItem.options = newItem.options.map(ele=>{
    //         if(ele.name!==name){
    //             return ele ;
    //         }else{
    //             return {...ele, value:value} ;
    //         }
    //     });
    //     newItemData[itemId] = newItem;
    //     setItemData(newItemData);
    // }
    // function selectItem(itemId :string){
    //     setSelectItemId(itemId);
    // }
    // function addSymToFlow(flowId :string,idx :number, symId :string){
    //     const oldFlow = getItem(flowId);
    //     if(oldFlow){
    //         const newSyms :string[] | undefined = oldFlow.syms?.reduce((p,v,i) :string[]=>{
    //             if(idx === i){
    //                 p.push(symId);
    //             }
    //             p.push(v);
    //             return p ;
    //         },[] as string[]);
    //         if(oldFlow.syms && idx >= oldFlow.syms.length){
    //             newSyms?.push(symId);
    //         }
    //         const newFlow = {...oldFlow, syms:newSyms} ;
    //         setItem(flowId,newFlow);
    //     }
    // }

    const items = useItems();
    const getItem = useGetItem();
    const addItem = useAddItem();
    const setItem = useSetItem();
    const removeItem = useRemoveItem();
    const setOption = useSetOption();
    const topFlows = useTopFlows();
    const selectItem = useSelectItem();
    const selectItemId = useSelectItemId();
    const mode = useMode();
    const addSymToFlow = useAddSymToFlow();

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






























