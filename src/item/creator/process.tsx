import ProcessSym from "components/sym/ProcessSym";
import ExecuteError from "error/ExecuteError";
import { Item } from "redux/types/item";
import { optionTypes } from "util/syms";
import { baseItemCreator, optionCreator } from "./base";


export function processSymCreator() :Item{
    const ans = baseItemCreator(
        "Process",
        ProcessSym,
        [
            // {name:"処理名", value:"処理", type:optionTypes["text"] } , 
            optionCreator("処理名",　"処理",　optionTypes["text"]),
            
        ],
    );
    ans.execute = async (runtime,item)=>{
        const callSymText = item.options[0].value as string ;
        const id = runtime.getProcesses()[callSymText] ;
        //console.log(`callSymText:${callSymText} id:${id}`);
        if(id){
            runtime.addExeItemId(0,id);
        }else{
            throw new ExecuteError(
                "unvalid callSymText :"+callSymText,
                `不正な処理を呼び出しました。存在していない処理を呼び出していないか確認してください。（処理名:${callSymText}）`) ;
        }
    } ;
    return ans ;
}

export function useProcessSymCreator() :()=>Item{
    return processSymCreator;
}

