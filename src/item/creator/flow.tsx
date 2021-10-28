import Flow from "components/sym/Flow";
import { Item } from "redux/types/item";
import { baseItemCreator, optionCreator } from "./base";
import { optionTypes } from "util/syms";


export function flowCreator(syms? :string[]) :Item{
    if(!syms){ syms = []; }
    const ans = baseItemCreator(
        "Flow",
        Flow
        ,
        [
            // {name:"タグ", value:"", type:optionTypes["text"]},
            optionCreator("タグ",　"",　optionTypes["text"]),
        ]
    );
    ans.syms = syms ;
    ans.execute = async (e , item)=>{
        const syms = item.syms?item.syms:[] as string[] ;
        const exeSyms = syms.reduce((p,v)=>{
            if(e.getItem(v)){
                p.push(v);
            }else{
                console.warn("unvalid flow syms :",v);
            }
            return p ;
        },[] as string[]);
        e.addExeItemId(0, ...exeSyms);
        await e.next();
    } ;
    return ans ;
}
