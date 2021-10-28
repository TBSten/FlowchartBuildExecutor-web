
import { Item } from "redux/types/item";

import Sym, { SymRender } from "./Sym";

export default function ProcessSym({id, item}: {id:string, item:Item}){
    const render :SymRender = (ctx,w,h,lw)=>{
        const base = 10 ;
        ctx.fillRect(lw/2,lw/2,w-lw,h-lw);
        ctx.strokeRect(lw/2,lw/2,w-lw,h-lw);
        ctx.beginPath();
        ctx.moveTo(base,lw/2);
        ctx.lineTo(base,h-lw/2);
        ctx.moveTo(w-base,lw/2);
        ctx.lineTo(w-base,h-lw/2);
        ctx.stroke();
    };
    const processName = item.options[0].value ;
    return(
        <Sym id={id} render={render}>
            {processName}
        </Sym>
    )
} ;



