import { Item, useGetItem } from "atom/syms";
import { ReactNode } from "react";
import Sym, { SymRender } from "./Sym" ;

export default function WhileSym({id,item} :{id:string,item:Item}) {
    const renderWhile :SymRender = (ctx,w,h,lw)=>{
    };
    const renderWhileTop :SymRender = (ctx,w,h,lw)=>{
        ctx.fillRect(0,0,w,h);
        ctx.strokeRect(lw/2,lw/2, w-lw,h-lw);
    };
    const renderWhileBottom :SymRender = (ctx,w,h,lw)=>{
        ctx.fillRect(0,0,w,h);
        ctx.strokeRect(lw/2,lw/2, w-lw,h-lw);
    };
    // const {getItem} = useEditItems();
    const getItem = useGetItem();
    let ChildrenComp :ReactNode = ()=><># WhileSym doesn't have child !</> ;
    if(item?.syms && item.syms[0]){
        const flowItem = getItem(item.syms[0]) ;
        if(flowItem){
            const Work = flowItem.component ;
            ChildrenComp = <Work id={item.syms[0]} item={flowItem} isRound={true}/> ;
            return (
                <Sym render={renderWhile} autoSize={false} id={id}>
                    <Sym render={renderWhileTop} id={id}>While TOP</Sym>
                    {ChildrenComp}
                    <Sym id={id} render={renderWhileBottom}>While BOTTOM</Sym>
                </Sym>
            ) ;
        }else{
            console.log("flowItem :",flowItem,"is deleted !");
            return null ;
        }
    }else{
        return (
            <Sym id={id} render={renderWhile}>
                # ERROR :While Child Sym must be Flow !
            </Sym>
        ) ;
    }
}

