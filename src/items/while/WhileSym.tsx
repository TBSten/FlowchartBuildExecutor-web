import { notImplement } from "src/lib/error";
import { useSym } from "src/redux/items/operations";
import SymBase, { SymChild, SymComponent, SymRender } from "../base/SymBase";
import Flow from "../flow/Flow";
import { getOption } from "../option";
import { corners } from "../util";

const TopChild: SymChild = ({ sym }) => {
    const cond = getOption(sym, "ループ条件")?.value;
    const isTop = getOption(sym, "判定タイミング")?.value === "前判定";
    if (!isTop) return <div>ループ</div>;
    if (cond && isTop) {
        return (
            <div>
                <div>
                    ループ
                </div>
                <div>
                    {cond}
                </div>
            </div>
        );
    }
    notImplement();
    return <></>;
};
const topRender: SymRender = (ctx, size) => {
    const c = corners(size.width, size.height, size.lineWidth);
    const base = 10;
    ctx.beginPath();
    ctx.moveTo(c.topLeft.x, c.topLeft.y + base);
    ctx.lineTo(c.topLeft.x + base, c.topLeft.y);
    ctx.lineTo(c.topRight.x - base, c.topRight.y);
    ctx.lineTo(c.topRight.x, c.topRight.y + 10);
    ctx.lineTo(c.bottomRight.x, c.bottomRight.y);
    ctx.lineTo(c.bottomLeft.x, c.bottomCenter.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};
const TopWhile = SymBase(TopChild, topRender);

const BottomChild: SymChild = ({ sym }) => {
    const cond = getOption(sym, "ループ条件")?.value;
    const isBottom = getOption(sym, "判定タイミング")?.value === "後判定";
    if (!isBottom) return <div>ループ</div>;
    if (cond && isBottom) {
        return <div>
            <div>ループ</div>
            <div>
                {cond}
            </div>
        </div>
    }
    notImplement();
    return <></>
};
const bottomRender: SymRender = (ctx, size) => {
    const c = corners(size.width, size.height, size.lineWidth);
    const base = 10;
    ctx.beginPath();
    ctx.moveTo(c.topLeft.x, c.topLeft.y);
    ctx.lineTo(c.topRight.x, c.topRight.y);
    ctx.lineTo(c.bottomRight.x, c.bottomRight.y - base);
    ctx.lineTo(c.bottomRight.x - base, c.bottomRight.y);
    ctx.lineTo(c.bottomLeft.x + base, c.bottomLeft.y);
    ctx.lineTo(c.bottomLeft.x, c.bottomLeft.y - base)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};
const BottomWhile = SymBase(BottomChild, bottomRender);

const WhileSym: SymComponent = ({ itemId }) => {
    const [sym] = useSym(itemId);
    const cond = getOption(sym, "ループ条件")?.value;
    if (cond) {
        return (
            <div>
                <TopWhile itemId={itemId} />
                <Flow flowId={sym.childrenItemIds[0]} round selectable={false} />
                <BottomWhile itemId={itemId} />
            </div>
        );
    }
    notImplement();
    return <></>;
};

export default WhileSym;

