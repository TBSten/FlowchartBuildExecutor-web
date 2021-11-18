import CalcSym from "components/sym/CalcSym";
import { Item } from "redux/types/item";
import { baseItemCreator, optionCreator,  } from "./base";
import { optionTypes } from "util/syms";
import ExecuteError from "error/ExecuteError";

export function calcSymCreator() :Item{
    const ans = baseItemCreator(
        "Calc",
        CalcSym,
        [
            // {name:"式", value:"0", type:optionTypes["text"] } , 
            // {name:"代入先変数", value:"変数", type:optionTypes["text"] } , 
            optionCreator("式",　"0",　optionTypes["text"]),
            optionCreator("代入先変数",　"変数",　optionTypes["text"]),
        ]
    );
    ans.execute = async (e,item)=>{
        const formula = item.options[0].value ;
        const variable = item.options[1].value ;
        const value = e.eval(formula) ;
        if(value || value === 0){
            e.setVar(variable,value);
        }else{
            throw new ExecuteError(
                "unvalid variable value :"+value,
                `計算結果が不正です。正しい計算式か確認してください。(式:${formula} , 計算結果:${value})`) ;
        }
    } ;
    return ans ;
}
export function useCalcSymCreator() :()=>Item{
    return calcSymCreator;
}

