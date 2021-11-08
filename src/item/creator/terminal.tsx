import TerminalSym from "components/sym/TerminalSym";
import { Item } from "redux/types/item";
import { optionTypes } from "util/syms";
import { baseItemCreator, optionCreator } from "./base";


export function terminalSymCreator(type :"はじめ"|"おわり" ="はじめ") :Item{
    const ans = baseItemCreator(
        "Terminal",
        TerminalSym,
        [
            // {name:"タイプ", value:type, type:optionTypes["select"], args:["はじめ","おわり"] } , 
            // {name:"はじめのテキスト", value:"", type:optionTypes["text"] } , 
            // {name:"おわりの返り値", value:"", type:optionTypes["text"] } , 
            optionCreator("タイプ",type , optionTypes["select"],["はじめ","おわり"],false ),
            optionCreator("はじめのテキスト",　"",　optionTypes["text"],null,(item)=>(item.options[0].value==="はじめ")),
            optionCreator("おわりの返り値",　"",　optionTypes["text"],null,(item)=>(item.options[0].value==="おわり")),
        ]
    );
    return ans ;
}

