import ForSym from "components/sym/ForSym";
import { useDispatch } from "react-redux";
import { setItem } from "redux/reducers/items";
import { Item } from "redux/types/item";
import { randomStr } from "util/functions";
import { flowCreator, whileSymCreator } from "util/itemCreator";
import { optionTypes } from "util/syms";
import { optionCreator } from "./base";

export function forSymCreator(syms?:string[]) :Item{
    const ans = whileSymCreator(syms) ;
    ans.itemType = "For" ;
    ans.component = ForSym ;
    ans.options = [
        // {name:"ループ変数", value:"i", type:optionTypes["text"] } , 
        // {name:"初期値", value:"0", type:optionTypes["text"]},
        // {name:"条件", value:"i < 10", type:optionTypes["text"]},
        // {name:"増分値", value:"1", type:optionTypes["text"] } , 
        optionCreator("ループ変数",　"i",　optionTypes["text"]),
        optionCreator("初期値",　"0",　optionTypes["text"]),
        optionCreator("条件",　"i < 10",　optionTypes["text"]),
        optionCreator("増分値",　"1",　optionTypes["text"]),

    ] ;
    ans.execute = async (runtime,item,id)=>{
        if(!id){
            throw new Error( "unvalid ForSym id :"+id ) ;
        }

        const loopVar = item.options[0].value ;
        const first = item.options[1].value ;
        const condition = item.options[2].value ;
        const inc = item.options[3].value ;

        const key = id+"-status" ;
        let status = runtime.getTemp(key) ; //console.log("For ::::",status) ;
        if(!status){
            runtime.putTemp(key, "for start");
            status = "for start" ;
            //ループ変数の初期化
            runtime.setVar(loopVar ,runtime.eval(first));
        }
        if(status === "for start"){
            //繰り返すか判定
            const con = runtime.eval( condition ) ;
            //もし繰り返すなら
            if(con === true){
                //子要素,ループ終わりを追加
                const syms = [...item.syms ?? []] ;
                syms.push(id) ; //ループ終わり
                runtime.addExeItemId(0, ...syms);

                runtime.putTemp(key, "for end");
            }else if(con === false){
                //終了なら
                runtime.putTemp(key, null);
            }else{
                throw new Error("unvalid ForSym condition :"+con) ;
            }
        }else if(status === "for end"){
            //インクリメント
            runtime.setVar(loopVar, runtime.eval(`${loopVar} + ${inc}`) ) ;
            runtime.addExeItemId(0,id) ; //ループはじめ
            runtime.putTemp(key, "for start");
            await runtime.next() ;
        }else{
            throw new Error("unvalid ForSym status:"+status) ;
        }
    } ;
    return ans ;
}

export function useForSymCreator() :()=>Item{
    const dispatch = useDispatch() ;
    return ()=>{
        const id = randomStr(30) ;
        const flow = flowCreator([]);
        dispatch(setItem(id,flow));
        return forSymCreator([id]);
    } ;
}


