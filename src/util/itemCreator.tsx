import Flow from "components/sym/Flow";
import Sym, { SymRender } from "components/sym/Sym";
import WhileSym from "components/sym/WhileSym";
import React from "react";
import {Option, Item, } from "../atom/syms" ;
import { optionTypes } from "./syms";

interface baseItemComponentProps {
    item :Item;
    id :number;
}

/* usage
baseItemCreator(()=><div>test</div>,[{name:"op1",value:"op1 value",type:"test op"},]);
*/
function baseItemCreator(
    component :(props :baseItemComponentProps)=>(React.ReactNode) , 
    options :Option<any>[]) :Item{
    return {
        component,
        options,
    } ;
}

export function calcSymCreator() :Item{
    const render :SymRender = (ctx,w,h,lw)=>{
        ctx.fillRect(0,0, w,h);
        ctx.strokeRect(lw/2,lw/2, w-lw,h-lw);
    };
    const ans = baseItemCreator(
        ({id, item}: {id:number, item:Item})=>{
            // console.log(item.options);
            return(
                <Sym id={id} render={render}>
                    {item.options[0].value} → {item.options[1].value}
                </Sym>
            )
        },
        [
            {name:"式", value:"0", type:optionTypes["text"] } , 
            {name:"代入先変数", value:"変数", type:optionTypes["text"] } , 
        ]
    );
    return ans ;
}

export function flowCreator(syms? :number[]) :Item{
    if(!syms){ syms = []; }
    const ans = baseItemCreator(
        ({item, id} :baseItemComponentProps)=>{
            // const {items} = useEditItems();
            // console.log("items ::",items,item);
            // const syms = item.syms? item.syms:[] ;

            return (
                <Flow id={id} item={item}/>
            ) ;
        },
        [
            {name:"タグ", value:"", type:optionTypes["text"]},
        ]
    );
    ans.syms = syms ;
    return ans ;
}

export function whileSymCreator(syms ?:number[]) :Item{
    if(! syms) { syms = [] ; }
    const ans = baseItemCreator(
        ({item, id} :baseItemComponentProps)=>{
            // console.log("WhileSym render !!!",item);
            return (
                <WhileSym id={id} item={item}/>
            );
        },
        [
            {name:"条件", value:"変数 < 10", type:optionTypes["text"]},
            {name:"タイプ", value:"前判定", type:optionTypes["select"], args:["前判定","後判定","データがある間"]},
        ],
    );
    ans.syms = syms ;
    return ans ;
}



