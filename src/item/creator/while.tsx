import WhileSym from "components/sym/WhileSym";
import { useDispatch } from "react-redux";
import { setItem } from "redux/items/actions";
import { Item } from "redux/types/item";
import { randomStr } from "util/functions";
import { flowCreator } from "item/creator/flow";
import { optionTypes } from "util/syms";
import { baseItemCreator, optionCreator } from "./base";


export function whileSymCreator(syms:string[]=[] ) :Item{
    if(! syms) { 
        console.error("WhileSym can't create without syms !",syms);
        syms = [] ;
    }
    const ans = baseItemCreator(
        "While",
        WhileSym,
        [
            // {name:"条件", value:"変数 < 5", type:optionTypes["text"]},
            // {name:"タイプ", value:"前判定", type:optionTypes["select"], args:["前判定","後判定","データがある間"]},
            optionCreator("条件",　"変数 < 5",　optionTypes["text"]),
            optionCreator("タイプ",　"前判定",　optionTypes["select"], ["前判定","後判定","データがある間"]),

        ],
    );
    ans.syms = syms ;
    ans.execute = async (e,item,id)=>{
        if(id){
            const state = e.getTemp<string>(id);
            let whichWhile = state ;
            if(!state){
                //first 
                whichWhile = "start" ;
            }
            const con = e.eval(item.options[0].value);
            // console.log( "while :",id,whichWhile );
            if(whichWhile === "start"){
                const syms = item.syms?item.syms:[] ;
                if(item.options[1].value === "前判定" ){
                    if(con){
                        e.addExeItemId(0,...syms,id);
                        e.putTemp(id, "end");
                    }else{
                        //ループ出る
                        e.putTemp(id, null);
                        // console.log("while","ループ出る");
                    }
                }else{
                    //後判定
                    e.addExeItemId(0,...syms,id);
                    e.putTemp(id, "end");
                }
            }else if(whichWhile === "end"){
                if(item.options[1].value === "前判定"){
                    e.addExeItemId(0,id);
                    e.putTemp(id, "start");
                }else{
                    //後判定
                    if(con){
                        e.addExeItemId(0,id);
                        e.putTemp(id, "start");
                    }else{
                        //ループ出る
                        e.putTemp(id, null);
                    }
                }
            }
        }else{
            throw new Error("unvalid id"+id);
        }
    } ;
    return ans ;
}

export function useWhileSymCreator() :()=>Item{
    const dispatch = useDispatch() ;
    return ()=>{
        const id = randomStr(30) ;
        const flow = flowCreator([]);
        dispatch(setItem(id,flow));
        return whileSymCreator([id]);
    } ;
}

