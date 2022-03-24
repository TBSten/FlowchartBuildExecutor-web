
import Box from "@mui/material/Box";
import ErrorView from "src/components/util/ErrorView";
import { useItem } from "src/redux/items/hooks";
import { isSym } from "src/redux/items/types";
import SymBase, { SymChild, SymComponent, SymRender } from "../base/SymBase";
import Flow from "../flow/Flow";
import { getOption } from "../option";
import { corners } from "../util";

const TopChild: SymChild = ({ sym }) => {
    const variable = getOption(sym, "ループ変数")?.value;
    const first = getOption(sym, "初期値")?.value;
    const condition = getOption(sym, "条件")?.value;
    const plus = getOption(sym, "増分")?.value;
    return (
        <Box fontSize={8} lineHeight="1.1em">
            <div>ループ</div>
            {variable} を {first} から {plus} ずつ増やし {condition} の間
        </Box>
    );
};
const topRender: SymRender = (ctx, size) => {
    const c = corners(size.width, size.height, size.lineWidth);
    ctx.beginPath();
    const base = c.height / 4;
    ctx.moveTo(c.topLeft.x, c.topLeft.y + base)
    ctx.lineTo(c.topLeft.x + base, c.topLeft.y);
    ctx.lineTo(c.topRight.x - base, c.topRight.y);
    ctx.lineTo(c.topRight.x, c.topRight.y + base);
    ctx.lineTo(c.bottomRight.x, c.bottomRight.y);
    ctx.lineTo(c.bottomLeft.x, c.bottomLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};
const ForTop = SymBase(TopChild, topRender);

const BottomChild: SymChild = ({ sym }) => {
    return (<Box fontSize={8}>ループ</Box>)
}
const bottomRender: SymRender = (ctx, size) => {
    const c = corners(size.width, size.height, size.lineWidth);
    ctx.beginPath();
    const base = c.height / 4;
    ctx.moveTo(c.topLeft.x, c.topLeft.y);
    ctx.lineTo(c.topRight.x, c.topRight.y);
    ctx.lineTo(c.bottomRight.x, c.bottomRight.y - base)
    ctx.lineTo(c.bottomRight.x - base, c.bottomRight.y)
    ctx.lineTo(c.bottomLeft.x + base, c.bottomLeft.y)
    ctx.lineTo(c.bottomLeft.x, c.bottomLeft.y - base)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}
const ForBottom = SymBase(BottomChild, bottomRender)

const ForSym: SymComponent = ({ itemId }) => {
    const [sym] = useItem(itemId);
    const childFlowId = sym?.childrenItemIds[0] ?? "";
    if (!isSym(sym)) return <ErrorView log={["不正な記号", sym]}>不正な記号です</ErrorView>
    return (
        <div>
            <ForTop itemId={itemId} />
            <Flow flowId={childFlowId} round selectable={false} />
            <ForBottom itemId={itemId} />
        </div>
    )
};

export default ForSym;

