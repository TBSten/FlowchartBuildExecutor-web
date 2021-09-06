import { Item } from "redux/types/item";
import Sym, { SymRender } from "./Sym";

export default function TerminalSym({id, item}: {id:string, item:Item}){
    const render :SymRender = (ctx,w,h,lw)=>{
        function degToRad(deg :number) :number{
            //360(deg) = 2*Math.PI(rad)
            return Math.PI * deg / 180 ;
        }
        ctx.beginPath();
        //Pathを考える
        ctx.moveTo(h/2,0+lw/2);
        ctx.lineTo(w-h/2,0+lw/2);
        ctx.arc(w-h/2,h/2,h/2-lw/2,degToRad(270),degToRad(90));
        ctx.lineTo(h/2,h-lw/2);
        ctx.arc(h/2,h/2,h/2-lw/2,degToRad(90),degToRad(270));
        ctx.fill();
        ctx.stroke();

    };
    return(
        <Sym id={id} render={render}>
            {item.options[0].value}
        </Sym>
    )
} ;
