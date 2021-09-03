// import { Item, useGetItem } from "atom/syms";
import {Item} from "redux/types/item" ;
import {useGetItem} from "redux/reducers/items" ;
import { ReactNode, } from "react";
import Sym, { SymRender } from "./Sym" ;


export default function WhileSym({id,item} :{id:string,item:Item}) {
    // console.log("WhileSym", item);
    const renderWhile :SymRender = (ctx,w,h,lw)=>{
    };
    const renderWhileTop :SymRender = (ctx,w,h,lw)=>{
        // ctx.fillRect(0,0,w,h);
        // ctx.strokeRect(lw/2,lw/2, w-lw,h-lw);
        const base = 10 ;
        ctx.beginPath();
        ctx.moveTo(base,0+lw/2);
        ctx.lineTo(w-base,0+lw/2);
        ctx.lineTo(w-lw/2,base);
        ctx.lineTo(w-lw/2,h-lw/2);
        ctx.lineTo(0+lw/2,h-lw/2);
        ctx.lineTo(0+lw/2,base);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    const renderWhileBottom :SymRender = (ctx,w,h,lw)=>{
        // ctx.fillRect(0,0,w,h);
        // ctx.strokeRect(lw/2,lw/2, w-lw,h-lw);
        const base = 10 ;
        ctx.beginPath();
        ctx.moveTo(lw/2,lw/2);
        ctx.lineTo(w-lw/2,lw/2);
        ctx.lineTo(w-lw/2,h-base);
        ctx.lineTo(w-base,h-lw/2);
        ctx.lineTo(base,h-lw/2);
        ctx.lineTo(lw/2,h-base);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    // const {getItem} = useEditItems();
    const getItem = useGetItem();
    let ChildrenComp :ReactNode = ()=><># WhileSym doesn't have child !</> ;
    if(item?.syms && item.syms[0]){
        const flowItem = getItem(item.syms[0]) ;
        // console.log("WhileSym flowItem:", flowItem, item.syms[0]);
        if(flowItem){
            const Work = flowItem.component ;
            ChildrenComp = <Work id={item.syms[0]} item={flowItem} isRound={true}/> ;
            return (
                <Sym render={renderWhile} autoSize={false} id={id}>
                    <Sym render={renderWhileTop} id={id}>
                        {getItem(id)?.options[0].value}/{getItem(id)?.options[1].value}
                    </Sym>
                    {ChildrenComp}
                    <Sym id={id} render={renderWhileBottom}>
                        While BOTTOM
                    </Sym>
                </Sym>
            ) ;
        }else{
            // console.log("flowItem :",flowItem,"is deleted !",item);
            return (
                <Sym id={id} render={renderWhile}>
                    flowItem unvalid
                    flowItem:{ flowItem }
                </Sym>) ;
        }
    }else{
        // console.log(item,item?.syms);
        return (
            <Sym id={id} render={renderWhile}>
                # ERROR :While Child Sym must be Flow !
                item.syms:{ item?.syms }
            </Sym>
        ) ;
    }
}

