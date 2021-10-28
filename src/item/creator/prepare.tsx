import PrepareSym from "components/sym/PrepareSym";
import { BaseType } from "exe/runtimes/types";
import { Item } from "redux/types/item";
import { optionTypes } from "util/syms";
import { baseItemCreator, optionCreator } from "./base";


export function prepareSymCreator() :Item{
    const ans = baseItemCreator(
        "Prepare",
        PrepareSym,
        [
            // {name:"タイプ", value:"1次元配列", type:optionTypes["select"],args:["1次元配列","2次元配列","3次元配列"] } , 
            // {name:"対象", value:"ARR", type:optionTypes["text"] } , 
            // {name:"初期値", value:"0", type:optionTypes["text"] } , 
            // {name:"要素数", value:"5", type:optionTypes["text"] } , 
            optionCreator("タイプ",　"1次元配列",　optionTypes["select"], ["1次元配列","2次元配列","3次元配列"]),
            optionCreator("対象",　"ARR",　optionTypes["text"]),
            optionCreator("初期値",　"0",　optionTypes["text"]),
            optionCreator("要素数",　"5",　optionTypes["text"]),

        ]
    );
    ans.execute = async (runtime,item)=>{
        const type = item.options[0].value ;
        const target :string = item.options[1].value ;
        const first = runtime.eval(item.options[2].value) ;
        const count = item.options[3].value ;
        if(type === "1次元配列"){
            const arr :BaseType[] = [] ;
            const cnt = parseInt(count) ;
            for(let i = 0;i < cnt;i++){
                arr[i] = first as BaseType ;
            }
            runtime.setVar(target,arr);
        }else if(type === "2次元配列"){
            const arr :BaseType[][] = [] ;
            const cnts = count.split(/\*|,/) ;
            const rowCnt = parseInt(cnts[0]) ;
            const colCnt = parseInt(cnts[1]) ;
            for(let i = 0;i < rowCnt;i++){
                arr.push([]);
                for(let j = 0;j < colCnt;j++){
                    arr[i][j] = first as BaseType ;
                }
            }
            runtime.setVar(target,arr);
        }else{
            throw new Error("unvalid type :"+type) ;
        }
    };
    return ans ;
}

export function usePrepareSymCreator() :()=>Item{
    return prepareSymCreator;
}


