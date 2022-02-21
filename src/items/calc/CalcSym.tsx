
import SymBase, { SymChild, SymRender } from "../base/SymBase";
import { corners } from "../util";

const Child:SymChild = ({sym})=>{
    return <div>{sym.options[0].value} {"→"} {sym.options[1].value}</div>
} ;
const render:SymRender = (ctx,size)=>{
    const c = corners(size.width,size.height,size.lineWidth) ;
    ctx.fillRect(
        c.topLeft.x,
        c.topLeft.y,
        size.width,
        size.height,
    ) ;
    ctx.strokeRect(
        c.topLeft.x,
        c.topLeft.y,
        c.width,
        c.height,
    );
} ;
const CalcSym = SymBase(Child,render) ;

export default CalcSym ;

