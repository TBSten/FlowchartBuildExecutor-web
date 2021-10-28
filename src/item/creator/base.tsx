import { Button } from "@material-ui/core";
import { Done, DoneAll, Delete,  } from "@material-ui/icons";
import Runtime from "exe/runtimes/Runtime";
import { useDispatch } from "react-redux";
import { removeItem, useGetItem, setItem } from "redux/reducers/items";
import { useSelectItemIds, useSelectItemId, selectItemById } from "redux/reducers/selectItem";
import { useTopFlows, removeTopFlow } from "redux/reducers/top";
import { 
    Item,
    Option,
} from "redux/types/item";
import { randomStr } from "util/functions";
import { flowCreator } from "util/itemCreator";
import { OptionType } from "util/syms";

interface baseItemComponentProps {
    item :Item;
    id :string;
}
const DeleteSymMenu = ()=>{
    const selectItemIds = useSelectItemIds();
    const topFlows = useTopFlows();
    const dispatch = useDispatch();
    const handleRemove = ()=>{
        //console.log(selectItemIds);
        selectItemIds.forEach(id=>{
            dispatch(removeItem(id));
            if(topFlows.includes(id)){
                dispatch(removeTopFlow(id));
            }
        });
    };
    return (
        <Button startIcon={<Delete />} onClick={handleRemove} color="primary" variant="outlined">
            記号を削除
        </Button>

    ) ;
};
const UnselectSymMenu = ()=>{
    const selectItemId = useSelectItemId();
    const dispatch = useDispatch();
    const handleUnselect = ()=>{
        dispatch(selectItemById(selectItemId));
    };
    return (
        <Button startIcon={<Done />} onClick={handleUnselect} color="primary" variant="outlined">
            選択解除
        </Button>
    ) ;
};
const UnselectAllSymMenu = ()=>{
    const dispatch = useDispatch();
    const handleUnselectAll = ()=>{
        dispatch(selectItemById("none"));
    };
    return (
        <Button startIcon={<DoneAll />} onClick={handleUnselectAll} color="primary" variant="outlined">
            全て選択解除
        </Button>
    ) ;
} ;
const AddFlowSymMenu = ()=>{
    const selectItemId = useSelectItemId();
    const switchSymId :string = selectItemId ;
    const getItem = useGetItem();
    const dispatch = useDispatch();
    function handleAddFlow(){
        const fid = randomStr(30);
        const f = flowCreator([]);
        dispatch(setItem(fid,f));
        const newSwitchSym = Object.assign({},getItem(switchSymId));
        let newSyms = newSwitchSym.syms?newSwitchSym.syms:[] ;
        newSyms = [...newSyms, fid] ;
        newSwitchSym.syms = newSyms ;
        dispatch(setItem(switchSymId,newSwitchSym));
        //console.log(fid,f,selectItemId,newSwitchSym);
    }
    return (
        <Button onClick={handleAddFlow} color="primary" variant="outlined">
            分岐先を追加する
        </Button>
    ) ;
} ;



export function baseItemCreator(
    itemType:string,
    component :(props :baseItemComponentProps)=>(React.ReactNode) , 
    options :Option<any>[]) :Item{
    const defMenus = [
        //delete
        {
            "name":"記号の操作",
            "component":[
                DeleteSymMenu,
            ],
        },
        //select
        {
            "name":"記号の選択",
            "component":[
                UnselectSymMenu,
                UnselectAllSymMenu,
            ],
        },
    ] ;
    async function execute(e :Runtime, item:Item){
        //console.log("exe",item);
    }
    return {
        itemType,
        component,
        options,
        menus:defMenus,
        execute,
    } ;
}

export function optionCreator<V>(name :string, value:V, type :OptionType, args?:any) :Option<V>{
    const ans :Option<V> = {
        name,
        value,
        type,
        visible:true,
    } ;
    if(args){
        ans.args = args ;
    }
    return ans ;
}

