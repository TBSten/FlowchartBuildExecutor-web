
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
const PrepareSym = BaseSymComponent(Child, render);

export default PrepareSym;

