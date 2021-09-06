import { Item } from "redux/types/item";
import Sym, { SymRender } from "./Sym";

export default function CalcSym({id, item}: {id:string, item:Item}){
    const render :SymRender = (ctx,w,h,lw)=>{
        ctx.fillRect(0,0, w,h);
        ctx.strokeRect(lw/2,lw/2, w-lw,h-lw);
    };
    return(
        <Sym id={id} render={render}>
            {item.options[0].value} → {item.options[1].value}
        </Sym>
    )
} ;
