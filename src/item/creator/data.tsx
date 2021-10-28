import DataSym from "components/sym/DataSym";
import { Item } from "redux/types/item";
import { optionTypes } from "util/syms";
import { baseItemCreator, optionCreator } from "./base";


export function dataSymCreator() :Item{
    const ans = baseItemCreator(
        "Data",
        DataSym,
        [
            // {name:"タイプ", value:"出力", type:optionTypes["select"],args:["キーボード入力","ファイルから入力","出力"] } , 
            // {name:"対象", value:"変数", type:optionTypes["text"] } , 
            optionCreator("タイプ",　"出力",　optionTypes["select"], ["キーボード入力","ファイルから入力","出力"]),
            optionCreator("対象",　"変数",　optionTypes["text"]),
        ]
    );
    ans.execute = async (e,item)=>{
        const type = item.options[0].value;
        const target = item.options[1].value ;
        if(type === "出力"){
            const outdata = e.eval(target) ;
            if(outdata || 
                outdata === false || 
                outdata === 0 ){
                //console.log("outdata :",outdata);
                await e.output(outdata);
            }else{
                console.error("unvalid outdata :",outdata) ;
            }
        }else if(type === "キーボード入力"){
            const input = await e.input(target+" を入力") ;
            if(input){
                e.setVar(target,input);
            }else{
                throw new Error("unvalid input :"+input);
            }
        }else if(type === "ファイルから入力"){
            
        }else{
            console.error("不正なタイプ :",type);
        }
    } ;
    return ans ;
}

export function useDataSymCreator() :()=>Item{
    return dataSymCreator;
}

