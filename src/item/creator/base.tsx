import { Done, DoneAll, Delete, FileCopy, } from "@material-ui/icons";
import Runtime from "exe/runtimes/Runtime";
import { removeItem, setItem } from "redux/reducers/items";
import { removeTopFlow } from "redux/reducers/top";
import { Item, Option } from "redux/types/item";
import { OptionType } from "util/syms";
import { store } from "redux/store" ;
import { deepCopy, randomStr } from "util/functions";
import { selectItemById } from "redux/reducers/selectItem";

interface baseItemComponentProps {
    item: Item;
    id: string;
}

export function baseItemCreator(
    itemType: string,
    component: (props: baseItemComponentProps) => React.ReactNode,
    options: Option<any>[]
): Item {
    const defMenus = [
        {
            label: "選択解除",
            onClick: () => {
                // alert("Delete");
                const selectItemId = store.getState().selectItem.id ;
                store.dispatch(selectItemById(selectItemId));
            }, 
            icon: <Done />,
        },
        {
            label: "全て選択解除",
            onClick: () => {
                // alert("Delete");
                store.dispatch(selectItemById("none"));
            }, 
            icon: <DoneAll />,
        },
        {
            label: "記号の削除",
            onClick: () => {
                //# selectItemIdx, dispatch , topFlows
                
                // const selectItemIds = useSelectItemIds();
                // const topFlows = useTopFlows();
                // const dispatch = useDispatch();
                const state = store.getState() ;
                const selectItemIds = state.selectItem.ids ;
                const topFlows = state.top.flows ;
                const dispatch = store.dispatch ;
                selectItemIds.forEach((id) => {
                    dispatch(removeItem(id));
                    if (topFlows.includes(id)) {
                        dispatch(removeTopFlow(id));
                    }
                });
            }, 
            icon: <Delete />,
        },
        {
            label: "複製",
            onClick: () => {
                //selectItemを複製してselectItemの次に追加
                const state = store.getState() ;
                const sourceId = state.selectItem.id ;
                const sourceSym = state.items[sourceId];
                const newId = randomStr(30) ;
                const newSym = deepCopy(sourceSym);
                let parentId = "" ;//sourceIdをsyms内に含むflowのid
                Object.keys(state.items).forEach(id=>{
                    const item = state.items[id] ;
                    if(item.syms?.includes(sourceId)){
                        parentId = id ;
                    }
                }) ;
                const newParentSym = deepCopy(state.items[parentId]) ;
                if(newParentSym.syms){
                    newParentSym.syms = newParentSym.syms.reduce((p,symId)=>{
                        p.push(symId);
                        if(symId === sourceId){
                            p.push(newId);
                        }
                        return p ;
                    },[] as string[]);
                }
                //要素追加
                store.dispatch(setItem(newId,newSym));
                //要素をフローに追加
                store.dispatch(setItem(parentId,newParentSym));
            }, 
            icon: <FileCopy />,
        },
    ];
    async function execute(e: Runtime, item: Item) {
        //console.log("exe",item);
    }
    return {
        itemType,
        component,
        options,
        menus: defMenus,
        execute,
    };
}

export function optionCreator<V>(
    name: string,
    value: V,
    type: OptionType,
    args?: any,
    visible: boolean | ((item: Item) => boolean) = true
): Option<V> {
    const ans: Option<V> = {
        name,
        value,
        type,
        isVisible: visible instanceof Function ? visible : (item) => visible,
    };

    if (args) {
        ans.args = args;
    }
    return ans;
}
