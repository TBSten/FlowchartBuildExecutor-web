
import BaseSymComponent, { SymChild, SymRender } from "../base/SymBase";

export const Child: SymChild = ({ sym }) => {
    const text = sym.options[0].value.toString();
    return <div> {text.match(/^(\s+)$|^()$/) ? "はじめ" : text} </div>
};
function degToRad(deg: number): number {
    //360(deg) = 2*Math.PI(rad)
    return Math.PI * deg / 180;
}
export const render: SymRender = (ctx, size) => {
    const w = size.width;
    const h = size.height;
    const lw = size.lineWidth;
    ctx.moveTo(h / 2, 0 + lw / 2);
    ctx.lineTo(w - h / 2, 0 + lw / 2);
    ctx.arc(w - h / 2, h / 2, h / 2 - lw / 2, degToRad(270), degToRad(90));
    ctx.lineTo(h / 2, h - lw / 2);
    ctx.arc(h / 2, h / 2, h / 2 - lw / 2, degToRad(90), degToRad(270));
    ctx.fill();
    ctx.stroke();
};
const TerminalStartSym = BaseSymComponent(Child, render);

export default TerminalStartSym;

