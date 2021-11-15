import {Item} from "redux/types/item" ;
import {useGetItem} from "redux/reducers/items" ;
import { ReactNode, } from "react";
import Sym, { SymRender } from "./Sym" ;
import styled from "styled-components";

const LeftAlign = styled.div`
    display: flex;
    flex-direction: column;
    justify-content:flex-start;
    align-items: flex-start;
`;

export function useLoopCnt() :number{
    return 0 ;
}
export function assignLoopCnt() {
}

export default function WhileSym({id,item} :{id:string,item:Item}) {
    // console.log("WhileSym", item);
    const loopCnt = useLoopCnt() ;
    const loopName = "ループ"+loopCnt ;
    const renderWhile :SymRender = (ctx,w,h,lw)=>{
    };
    const renderWhileTop :SymRender = (ctx,w,h,lw)=>{
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
                // <Sym render={renderWhile} autoSize={false} id={id}>
                    <LeftAlign>
                        <Sym render={renderWhileTop} id={id}>
                            <div> {loopName} </div>
                            { getItem(id)?.options[1].value === "前判定" ? getItem(id)?.options[0].value : ""}
                            { getItem(id)?.options[1].value === "データがある間" ? getItem(id)?.options[0].value+" にデータがある間" : ""}
                            { getItem(id)?.options[1].value === "後判定" ? "" : ""}
                        </Sym>
                        {ChildrenComp}
                        <Sym render={renderWhileBottom} id={id}>
                            <div> {loopName} </div>
                            { getItem(id)?.options[1].value === "前判定" ? "" : ""}
                            { getItem(id)?.options[1].value === "データがある間" ? "" : ""}
                            { getItem(id)?.options[1].value === "後判定" ? getItem(id)?.options[0].value : ""}
                        </Sym>
                    </LeftAlign>
                // </Sym>
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

