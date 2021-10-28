
import { Item } from "redux/types/item";
import { corners } from "util/syms";
import Sym, { SymRender } from "./Sym";

export default function DataSym({id, item}: {id:string, item:Item}){
    const render :SymRender = (ctx,w,h,lw)=>{
        const corner = corners(w,h,lw);
        const base = h/2;
        ctx.beginPath();
        ctx.moveTo(base,lw/2);
        ctx.lineTo(w-base,lw/2);
        ctx.lineTo(...corner.rightCenter);
        ctx.lineTo(w-base,h-lw/2);
        ctx.lineTo(base,h-lw/2);
        ctx.lineTo(...corner.leftCenter);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    const type = item.options[0].value ;
    const name = item.options[1].value ;
    return(
        <Sym id={id} render={render}>
            {type} , {name} を準備する
        </Sym>
    )
} ;



