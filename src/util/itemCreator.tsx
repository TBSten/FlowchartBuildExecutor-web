import Flow from "components/sym/Flow";
import Sym, { SymRender } from "components/sym/Sym";
import WhileSym from "components/sym/WhileSym";
import React from "react";
import {Option, Item, useAddItem, useEditItems } from "../atom/syms" ;
import { optionTypes } from "./syms";


interface baseItemComponentProps {
    item :Item;
    id :string;
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
        ({id, item}: {id:string, item:Item})=>{
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

// interface flowComponentProps extends baseItemComponentProps{
//     isRound? :boolean,
// }

export function flowCreator(syms? :string[]) :Item{
    if(!syms){ syms = []; }
    const ans = baseItemCreator(
        // ({item, id, isRound} :flowComponentProps)=>{
        //     return (
        //         <Flow id={id} item={item} isRound={isRound}/>
        //     ) ;
        // },
        Flow
        ,
        [
            {name:"タグ", value:"", type:optionTypes["text"]},
        ]
    );
    ans.syms = syms ;
    return ans ;
}

export function whileSymCreator(syms ?:string[] ) :Item{
    if(! syms) { 
        console.error("WhileSym can't create without syms !",syms);
        // const addItem = useAddItem();
        // const flow = flowCreator();
        // const flowId = addItem(flow);
        // syms = [flowId] ;
        syms = [] ;
    }
    const ans = baseItemCreator(
        WhileSym,
        [
            {name:"条件", value:"変数 < 10", type:optionTypes["text"]},
            {name:"タイプ", value:"前判定", type:optionTypes["select"], args:["前判定","後判定","データがある間"]},
        ],
    );
    ans.syms = syms ;
    return ans ;
}



export type ItemCreator = {
    name :string,
    description :string,
    useCreator:()=>void,
    creator: ()=>Item,
} ;


const itemCreators :ItemCreator[] = [
    {
        name:"計算",
        description:"変数に値を代入します",
        creator:calcSymCreator,
        useCreator:()=>{},
    },
    {
        name:"繰り返し1",
        description:"条件が成立する間繰り返します",
        creator:whileSymCreator,
        useCreator:()=>{},
    },
] ;

export default itemCreators ;


