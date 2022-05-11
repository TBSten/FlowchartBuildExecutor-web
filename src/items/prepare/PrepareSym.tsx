
import { Box, BoxProps } from "@mui/material";
import BaseSymComponent, { SymChild, SymRender } from "../base/SymBase";
import { getOption } from "../option";
import { corners } from "../util";

const Child: SymChild = ({ sym }) => {
    const name = getOption(sym, "準備対象")?.value;
    const type = getOption(sym, "種類")?.value;
    const first = getOption(sym, "初期値")?.value;
    const cnt = getOption(sym, "要素数")?.value;
    const ease = getOption(sym, "簡易表示")?.value;
    const props: BoxProps = {
        fontSize: "12.5px"
    }
    if (ease) {
        return (
            <Box {...props}>
                {type}の{name}を準備
            </Box>
        )
    }
    return (
        <Box {...props}>
            {type}の{name}を,初期値{first},要素数{cnt}で初期化
        </Box>
    )
};
const render: SymRender = (ctx, size) => {
    const c = corners(size.width, size.height, size.lineWidth);
    const base = c.height / 4;
    ctx.beginPath();
    ctx.moveTo(base, c.topLeft.y);
    ctx.lineTo(c.topRight.x - base, c.topRight.y);
    ctx.lineTo(c.topRight.x, c.height / 2);
    ctx.lineTo(c.bottomRight.x - base, c.bottomRight.y);
    ctx.lineTo(base, c.bottomLeft.y);
    ctx.lineTo(c.topLeft.x, c.height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};
const PrepareSym = BaseSymComponent(Child, render);

export default PrepareSym;

