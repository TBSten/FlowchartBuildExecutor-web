
import BaseSymComponent, { SymChild, SymRender } from "../base/SymBase";
import { getOption } from "../option";
import { corners } from "../util";

const Child: SymChild = ({ sym }) => {
    const name = getOption(sym, "準備対象")?.value;
    const type = getOption(sym, "種類")?.value;
    const first = getOption(sym, "初期値")?.value;
    const cnt = getOption(sym, "要素数")?.value;
    const ease = getOption(sym, "簡易表示")?.value;
    if (ease) {
        return <div>
            {type}の{name}を準備
        </div>
    }
    return <div>{type}の{name}を,初期値{first},要素数{cnt}で初期化</div>
};
const render: SymRender = (ctx, size) => {
    const c = corners(size.width, size.height, size.lineWidth);
    const base = c.height / 2;
    ctx.beginPath();
    ctx.moveTo(base, c.topLeft.y);
    ctx.lineTo(c.topRight.x - base, c.topRight.y);
    ctx.lineTo(c.topRight.x, base);
    ctx.lineTo(c.bottomRight.x - base, c.bottomRight.y);
    ctx.lineTo(base, c.bottomLeft.y);
    ctx.lineTo(c.topLeft.x, base);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};
const PrepareSym = BaseSymComponent(Child, render);

export default PrepareSym;

