import SwitchBranchSym from "components/sym/SwitchBranchSym";
import { useDispatch } from "react-redux";
import { setItem } from "redux/items/actions";
import { Item } from "redux/types/item";
import { randomStr } from "util/functions";
import { flowCreator } from "item/creator/flow";
import { optionTypes } from "util/syms";
import { baseItemCreator, optionCreator } from "./base";

// const AddFlowSymMenu = ()=>{
//     const selectItemId = useSelectItemId();
//     const switchSymId :string = selectItemId ;
//     const getItem = useGetItem();
//     const dispatch = useDispatch();
//     function handleAddFlow(){
//         const fid = randomStr(30);
//         const f = flowCreator([]);
//         dispatch(setItem(fid,f));
//         const newSwitchSym = Object.assign({},getItem(switchSymId));
//         let newSyms = newSwitchSym.syms?newSwitchSym.syms:[] ;
//         newSyms = [...newSyms, fid] ;
//         newSwitchSym.syms = newSyms ;
//         dispatch(setItem(switchSymId,newSwitchSym));
//         //console.log(fid,f,selectItemId,newSwitchSym);
//     }
//     return (
//         <Button onClick={handleAddFlow} color="primary" variant="outlined">
//             分岐先を追加する
//         </Button>
//     ) ;
// } ;


export function switchBranchSymCreator(syms? :string[]) :Item{
    if(!syms || syms.length < 2){
        console.error("ERROR BranchSym.syms is invalid :",syms);
        syms = [] ;
    }
    const ans = baseItemCreator(
        "SwitchBranch",
        SwitchBranchSym,
        [
            // {name:"条件", value:"変数", type:optionTypes["text"] } , 
            // {name:"記号外に表示する", value:false, type:optionTypes["check"] } , 
            optionCreator("条件", "変数", optionTypes["text"]),
            optionCreator("記号外に表示する", false , optionTypes["check"]),

        ]
    );
    ans.syms = syms ;
    // ans.menus = ans.menus.filter(el=>el.name !== "記号の操作")
    // ans.menus.push({"name":"分岐先","component":[AddFlowSymMenu,]});
    // ans.execute = async (runtime,item,)=>{
    //     const con = item.options[0].value ;
    //     const symItems = (item.syms?item.syms:[]).map(el=>{
    //         const ans = runtime.getItem(el) ; 
    //         if(ans){
    //             return ans ;
    //         }else{
    //             throw new Error("unvalid item "+ans) ;
    //         }
    //     });
    //     let idx :number|null = null ;
    //     symItems.forEach((el,i)=>{
    //         if(idx === null && el.options[0].name === "タグ"){
    //             if(el.options[0].value === "その他"){
    //                 idx = i ;
    //             }else if(runtime.eval(el.options[0].value) === runtime.eval(con)){
    //                 idx = i ;
    //             }else{
    //             }
    //         }
    //     });
    //     if(idx && item.syms){
    //         runtime.addExeItemId(0,item.syms[idx]);
    //     }else{
    //         throw new Error("unvalid branch "+item) ;
    //     }
    // } ;
    return ans ;
}

export function useSwitchSymCreator() :()=>Item{
    //doubleBranchSymCreator
    const dispatch = useDispatch();
    return ()=>{
        const f1Id = randomStr(30) ;
        const f2Id = randomStr(30) ;
        const f3Id = randomStr(30) ;
        //console.log("doubleSymCreator :",f1Id,f2Id);
        const f1 = flowCreator([]);
        const f2 = flowCreator([]);
        const f3 = flowCreator([]);
        f1.options[0].value = "1" ;
        f2.options[0].value = "2" ;
        f3.options[0].value = "その他" ;
        // f1.menus = f1.menus.filter(el=>(el.name !== "記号の操作"))
        // f2.menus = f2.menus.filter(el=>(el.name !== "記号の操作"))
        // f3.menus = f3.menus.filter(el=>(el.name !== "記号の操作"))
        dispatch(setItem(f1Id,f1));
        dispatch(setItem(f2Id,f2));
        dispatch(setItem(f3Id,f3));
        return switchBranchSymCreator([f1Id,f2Id,f3Id]) ;
    } ;
}


