import DoubleBranchSym from "components/sym/DoubleBranchSym";
import { useDispatch } from "react-redux";
import { setItem } from "redux/reducers/items";
import { Item } from "redux/types/item";
import { randomStr } from "util/functions";
import { flowCreator } from "item/creator/flow";
import { optionTypes } from "util/syms";
import { baseItemCreator, optionCreator } from "./base";


export function doubleBranchSymCreator(syms? :string[]) :Item{
    if(!syms || syms.length !== 2){
        console.error("ERROR BranchSym.syms is invalid :",syms);
        syms = [] ;
    }
    const ans = baseItemCreator(
        "DoubleBranch",
        DoubleBranchSym,
        [
            // {name:"条件", value:"変数 = 0", type:optionTypes["text"] } , 
            // {name:"記号外に表示する", value:false, type:optionTypes["check"] } , 
            optionCreator("条件",　"変数 = 0",　optionTypes["text"]),
            optionCreator("記号外に表示する",　false,　optionTypes["check"]),
        ]
    );
    ans.syms = syms ;
    ans.execute = async (e,item)=>{
        const con = item.options[0].value ;
        const value = e.eval(con) ;
        if(item.syms){
            if(value === true){
                e.addExeItemId(0, item.syms[0]);
            }else if(value === false){
                e.addExeItemId(0, item.syms[1]);
            }else{
                throw new Error("unvalid conditions"+con+" is "+value);
            }
        }
    } ;
    return ans ;
}

export function useDoubleBranchSymCreator() :()=>Item{
    //doubleBranchSymCreator
    const dispatch = useDispatch();
    return ()=>{
        const f1Id = randomStr(30) ;
        const f2Id = randomStr(30) ;
        //console.log("doubleSymCreator :",f1Id,f2Id);
        const f1 = flowCreator([]);
        const f2 = flowCreator([]);
        dispatch(setItem(f1Id,f1));
        dispatch(setItem(f2Id,f2));
        return doubleBranchSymCreator([f1Id,f2Id]) ;
    } ;
}
