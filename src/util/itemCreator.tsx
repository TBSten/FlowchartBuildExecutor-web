import { setItem } from "redux/reducers/items";
import Flow from "components/sym/Flow";
import WhileSym from "components/sym/WhileSym";
import TerminalSym from "components/sym/TerminalSym";
import React from "react";
import {Item, Option, } from "redux/types/item" ;
import { OptionType, optionTypes } from "./syms";
import { useDispatch } from "react-redux";
import { randomStr } from "./functions";
import CalcSym from "components/sym/CalcSym";
import DoubleBranchSym from "components/sym/DoubleBranchSym";
import SwitchBranchSym from "components/sym/SwitchBranchSym";
import Button from "@material-ui/core/Button";
import { useSelectItemId, useSelectItemIds, selectItemById} from "redux/reducers/selectItem" ;
import { useGetItem, removeItem,  } from "redux/reducers/items" ;
import DataSym from "components/sym/DataSym";
import PrepareSym from "components/sym/PrepareSym";
import Delete from "@material-ui/icons/Delete" ;
import { Done, DoneAll } from "@material-ui/icons";
import ProcessSym from "components/sym/ProcessSym";
import Runtime from "exe/runtimes/Runtime" ;
import {BaseType} from "exe/runtimes/types" ;
import { useTopFlows, removeTopFlow,  } from "redux/reducers/top";
import ForSym from "components/sym/ForSym";


export interface baseItemComponentProps {
    item :Item;
    id :string;
}


const DeleteSymMenu = ()=>{
    const selectItemIds = useSelectItemIds();
    const topFlows = useTopFlows();
    const dispatch = useDispatch();
    const handleRemove = ()=>{
        //console.log(selectItemIds);
        selectItemIds.forEach(id=>{
            dispatch(removeItem(id));
            if(topFlows.includes(id)){
                dispatch(removeTopFlow(id));
            }
        });
    };
    return (
        <Button startIcon={<Delete />} onClick={handleRemove} color="primary" variant="outlined">
            記号を削除
        </Button>

    ) ;
};
const UnselectSymMenu = ()=>{
    const selectItemId = useSelectItemId();
    const dispatch = useDispatch();
    const handleUnselect = ()=>{
        dispatch(selectItemById(selectItemId));
    };
    return (
        <Button startIcon={<Done />} onClick={handleUnselect} color="primary" variant="outlined">
            選択解除
        </Button>
    ) ;
};
const UnselectAllSymMenu = ()=>{
    const dispatch = useDispatch();
    const handleUnselectAll = ()=>{
        dispatch(selectItemById("none"));
    };
    return (
        <Button startIcon={<DoneAll />} onClick={handleUnselectAll} color="primary" variant="outlined">
            全て選択解除
        </Button>
    ) ;
} ;
const AddFlowSymMenu = ()=>{
    const selectItemId = useSelectItemId();
    const switchSymId :string = selectItemId ;
    const getItem = useGetItem();
    const dispatch = useDispatch();
    function handleAddFlow(){
        const fid = randomStr(30);
        const f = flowCreator([]);
        dispatch(setItem(fid,f));
        const newSwitchSym = Object.assign({},getItem(switchSymId));
        let newSyms = newSwitchSym.syms?newSwitchSym.syms:[] ;
        newSyms = [...newSyms, fid] ;
        newSwitchSym.syms = newSyms ;
        dispatch(setItem(switchSymId,newSwitchSym));
        //console.log(fid,f,selectItemId,newSwitchSym);
    }
    return (
        <Button onClick={handleAddFlow} color="primary" variant="outlined">
            分岐先を追加する
        </Button>
    ) ;
} ;





function optionCreator<V>(name :string, value:V, type :OptionType, args?:any) :Option<V>{
    const ans :Option<V> = {
        name,
        value,
        type,
        visible:true,
    } ;
    if(args){
        ans.args = args ;
    }
    return ans ;
}

function baseItemCreator(
    itemType:string,
    component :(props :baseItemComponentProps)=>(React.ReactNode) , 
    options :Option<any>[]) :Item{
    const defMenus = [
        //delete
        {
            "name":"記号の操作",
            "component":[
                DeleteSymMenu,
            ],
        },
        //select
        {
            "name":"記号の選択",
            "component":[
                UnselectSymMenu,
                UnselectAllSymMenu,
            ],
        },
    ] ;
    async function execute(e :Runtime, item:Item){
        //console.log("exe",item);
    }
    return {
        itemType,
        component,
        options,
        menus:defMenus,
        execute,
    } ;
}


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
            throw new Error("unvalid variable value :"+value) ;
        }
    } ;
    return ans ;
}

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

export function terminalSymCreator(type :"はじめ"|"おわり" ="はじめ") :Item{
    const ans = baseItemCreator(
        "Terminal",
        TerminalSym,
        [
            // {name:"タイプ", value:type, type:optionTypes["select"], args:["はじめ","おわり"] } , 
            // {name:"はじめのテキスト", value:"", type:optionTypes["text"] } , 
            // {name:"おわりの返り値", value:"", type:optionTypes["text"] } , 
            optionCreator("タイプ",type , optionTypes["select"],["はじめ","おわり"] ),
            optionCreator("はじめのテキスト",　"",　optionTypes["text"]),
            optionCreator("おわりの返り値",　"",　optionTypes["text"]),
        ]
    );
    return ans ;
}

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
            optionCreator("条件",　"変数",　optionTypes["text"]),
            optionCreator("記号外に表示する", false ,　optionTypes["check"]),

        ]
    );
    ans.syms = syms ;
    // ans.menus = ans.menus.filter(el=>el.name !== "記号の操作")
    ans.menus.push({"name":"分岐先","component":[AddFlowSymMenu,]});
    ans.execute = async (runtime,item,)=>{
        const con = item.options[0].value ;
        const symItems = (item.syms?item.syms:[]).map(el=>{
            const ans = runtime.getItem(el) ; 
            if(ans){
                return ans ;
            }else{
                throw new Error("unvalid item "+ans) ;
            }
        });
        let idx :number|null = null ;
        symItems.forEach((el,i)=>{
            if(idx === null && el.options[0].name === "タグ"){
                if(el.options[0].value === "その他"){
                    idx = i ;
                }else if(runtime.eval(el.options[0].value) === runtime.eval(con)){
                    idx = i ;
                }else{
                }
            }
        });
        if(idx && item.syms){
            runtime.addExeItemId(0,item.syms[idx]);
        }else{
            throw new Error("unvalid branch "+item) ;
        }
    } ;
    return ans ;
}

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
            throw new Error("unvalid callSymText :"+callSymText) ;
        }
    } ;
    return ans ;
}
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



// //addItem hooks 
function useCalcSymCreator() :()=>Item{
    return calcSymCreator;
}
function useWhileSymCreator() :()=>Item{
    const dispatch = useDispatch() ;
    return ()=>{
        const id = randomStr(30) ;
        const flow = flowCreator([]);
        dispatch(setItem(id,flow));
        return whileSymCreator([id]);
    } ;
}
function useDoubleSymCreator() :()=>Item{
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
function useSwitchSymCreator() :()=>Item{
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
        f1.menus = f1.menus.filter(el=>(el.name !== "記号の操作"))
        f2.menus = f2.menus.filter(el=>(el.name !== "記号の操作"))
        f3.menus = f3.menus.filter(el=>(el.name !== "記号の操作"))
        dispatch(setItem(f1Id,f1));
        dispatch(setItem(f2Id,f2));
        dispatch(setItem(f3Id,f3));
        return switchBranchSymCreator([f1Id,f2Id,f3Id]) ;
    } ;
}
function useDataSymCreator() :()=>Item{
    return dataSymCreator;
}
function usePrepareSymCreator() :()=>Item{
    return prepareSymCreator;
}
function useProcessSymCreator() :()=>Item{
    return processSymCreator;
}
function useForSymCreator() :()=>Item{
    const dispatch = useDispatch() ;
    return ()=>{
        const id = randomStr(30) ;
        const flow = flowCreator([]);
        dispatch(setItem(id,flow));
        return forSymCreator([id]);
    } ;
}

export class ItemCreator{
    name :string;
    description :string;
    creator :()=> ()=>Item;
    constructor(
        name :string, 
        description :string, 
        creator :()=> ()=>Item){
            this.name = name ;
            this.description = description ;
            this.creator = creator ;
    }
}


export default [
    new ItemCreator("計算","数字や文字を変数に代入します",useCalcSymCreator),
    new ItemCreator("繰り返し1","条件が成り立つ間繰り返します",useWhileSymCreator),
    new ItemCreator("繰り返し2","ループ用変数を使って繰り返します",useForSymCreator),
    new ItemCreator("分岐1","条件のYesとNoで処理を分岐します",useDoubleSymCreator),
    new ItemCreator("分岐2","式によって多分岐します",useSwitchSymCreator),
    new ItemCreator("データ","データを入出力します",useDataSymCreator),
    new ItemCreator("準備","配列などを準備します",usePrepareSymCreator),
    new ItemCreator("定義済み処理","別のフロー（関数）を実行します",useProcessSymCreator),
] as ItemCreator[];











