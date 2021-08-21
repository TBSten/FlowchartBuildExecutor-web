import { Item, useEditItems } from "atom/syms";
import Arrow from "components/sym/Arrow";
import { ReactNode } from "react";
import Sym, { SymRender } from "./Sym" ;



export default function WhileSym({id,item} :{id:number,item:Item}) {
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
    const {getItem} = useEditItems();
    let ChildrenComp :ReactNode = ()=><># WhileSym doesn't have child !</> ;
    if(item?.syms && item.syms[0]){
        const flowItem = getItem(item.syms[0]) ;
        const Work = flowItem.component ;
        ChildrenComp = <Work id={item.syms[0]} item={flowItem}/> ;
        return (
            <Sym render={renderWhile} autoSize={false}id={id}>
                <Sym render={renderWhileTop}id={id}>While TOP</Sym>
                <Arrow addable={false}/>
                {ChildrenComp}
                {
                    flowItem.syms && flowItem.syms.length <= 0?
                    "":
                    <Arrow addable={false}/>
                }
                <Sym id={id} render={renderWhileBottom}>While BOTTOM</Sym>
            </Sym>
        ) ;
    }else{
        return (
            <Sym id={id} render={renderWhile}>
                # ERROR :While Child Sym must be Flow !
            </Sym>
        ) ;
    }
}