
import BaseSymComponent, { SymChild, SymRender } from "../base/SymBase";
import { getOption } from "../option";
import { corners } from "../util";

const Child: SymChild = ({ sym }) => {
    const flowName = getOption(sym, "処理名")?.value;
    return <div>{flowName}</div>
};
const render: SymRender = (ctx, size) => {
    const c = corners(size.width, size.height, size.lineWidth);
    const base = c.height / 4;
    ctx.fillRect(c.topLeft.x, c.topLeft.y, c.width, c.height);
    ctx.strokeRect(c.topLeft.x, c.topLeft.y, c.width, c.height);
    ctx.beginPath();
    ctx.moveTo(base, 0);
    ctx.lineTo(base, size.height);
    ctx.moveTo(size.width - base, 0);
    ctx.lineTo(size.width - base, size.height);
    ctx.closePath();
    ctx.stroke();
};
const ProcessSym = BaseSymComponent(Child, render);

export default ProcessSym;

