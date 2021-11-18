
import { Item } from "redux/types/item";
import { corners } from "util/syms";
import Sym, { SymRender } from "./Sym";

export default function DataSym({id, item}: {id:string, item:Item}){
    const render :SymRender = (ctx,w,h,lw)=>{
        const corner = corners(w,h,lw);
        const base = h/2;
        ctx.beginPath();
        ctx.moveTo(base,lw/2);
        ctx.lineTo(...corner.rightTop);
        ctx.lineTo(w-base,h-lw/2);
        ctx.lineTo(...corner.leftBottom);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    const typ = item.options[0].value ;
    const tar = item.options[1].value ;
    const isNum = item.options[2].value ;
    return(
        <Sym id={id} render={render}>
            {
                typ === "キーボード入力"?
                `${tar}を入力${isNum?"(数値)":""}`
                :
                typ === "ファイルから入力"?
                `${tar}から1行読む`
                :
                typ === "出力"?
                `${tar}を出力`
                :
                "# ERRO invalid type :"+typ
            }
        </Sym>
    )
} ;



