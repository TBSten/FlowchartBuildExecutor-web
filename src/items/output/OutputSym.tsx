
import SymBase, { SymChild, SymRender } from "../base/SymBase";
import { corners } from "../util";

const Child:SymChild = ({sym})=>{
    return <div>{sym.options[0].value}を出力</div>
} ;
const render:SymRender = (ctx,size)=>{
    const c = corners(size.width,size.height,size.lineWidth) ;
    const base = c.height / 2 ;
    const lw = size.lineWidth ;

    ctx.beginPath();
    ctx.moveTo(base,lw/2);
    ctx.lineTo(c.topRight.x,c.topRight.y);
    ctx.lineTo(c.bottomRight.x-base,c.bottomRight.y);
    ctx.lineTo(c.bottomLeft.x,c.bottomLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
} ;
const OutputSym = SymBase(Child,render) ;

export default OutputSym ;

