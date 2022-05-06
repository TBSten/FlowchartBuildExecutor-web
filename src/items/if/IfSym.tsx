import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FC, ReactNode, useEffect, useRef } from "react";
import ErrorView from "src/components/util/ErrorView";
import { config } from "src/items/base/SymBase";
import { logger } from "src/lib/logger";
import { useItem } from "src/redux/items/hooks";
import { getItem } from "src/redux/items/selectors";
import { isFlow, ItemId } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/hooks";
import BaseSymComponent, {
    SymChild,
    SymComponent,
    SymRender
} from "../base/SymBase";
import Flow from "../flow/Flow";
import { corners } from "../util";

const DiamondChild: SymChild = ({ sym }) => {
    return <div>{sym.options[0].value}</div>;
};
const diamondRender: SymRender = (ctx, size) => {
    const c = corners(size.width, size.height, size.lineWidth);
    ctx.beginPath();
    ctx.moveTo(c.topCenter.x, c.topCenter.y);
    ctx.lineTo(c.centerRight.x, c.centerRight.y);
    ctx.lineTo(c.bottomCenter.x, c.bottomCenter.y);
    ctx.lineTo(c.centerLeft.x, c.centerLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};
const Diamond = BaseSymComponent(DiamondChild, diamondRender);

export const BranchBase = (
    labels: ReactNode[] | ((parentSiwtchId: ItemId, childFlowId: ItemId) => ReactNode),
    // childrenSelectable: boolean = false,
) => {
    const Branch: SymComponent = ({ itemId }) => {
        logger.warn("branch render when state.items changed . i will fix many rendering .")
        const containerRef = useRef<HTMLDivElement>(null);
        const symsRef = useRef<(HTMLDivElement | null)[]>([]);
        const childFlowIds = useAppSelector(state => {
            const parent = getItem(itemId)(state);
            return parent?.childrenItemIds ?? [];
        });
        const flowIdToLabel = (flowId: ItemId, idx: number) => {
            if (labels instanceof Array) {
                return labels[idx];
            } else {
                return labels(itemId, flowId);
            }
        };
        const canvasRef = useRef<HTMLCanvasElement>(null);
        useEffect(() => {
            const container = containerRef.current;
            const canvas = canvasRef?.current;
            if (!canvas || !container) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            const syms = symsRef.current;
            ctx.strokeStyle = config.color.fore;
            ctx.lineWidth = config.size.lineWidth;
            syms.forEach((symDiv) => {
                const x = config.size.width / 2;
                const y = config.size.height / 2;
                const w = symDiv?.offsetLeft ?? 0;
                const h = (symDiv?.offsetHeight ?? 0) + config.size.height;
                ctx.strokeRect(x, y, w, h);
            });
            ctx.beginPath();
            ctx.moveTo(config.size.width / 2, config.size.height / 2);
            ctx.lineTo(config.size.width / 2, container.offsetHeight);
            ctx.closePath();
            ctx.stroke();
        });
        return (
            <Box sx={{ position: "relative" }} ref={containerRef}>
                <Diamond itemId={itemId} />
                <Stack direction="row" spacing={1}>
                    {childFlowIds.map((childFlowId, idx) => (
                        <div
                            ref={(ref) => (symsRef.current[idx] = ref)}
                            key={childFlowId}
                        >
                            <ChildFlow flowId={childFlowId} label={flowIdToLabel(childFlowId, idx)} />
                        </div>
                    ))}
                </Stack>
                <Box
                    sx={{
                        width: config.size.width,
                        height: config.size.height,
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: -1,
                    }}
                >
                    <canvas ref={canvasRef} width="auto" height="auto" />
                </Box>
            </Box >
        );
    };
    return Branch;
};
const ChildFlow: FC<{ flowId: ItemId, label: ReactNode }> = ({ flowId, label }) => {
    const [flow] = useItem(flowId);
    if (!isFlow(flow)) return <ErrorView log={[flow]} />;
    return (
        <>
            <Flow
                flowId={flowId}
                round
                bottomArrow={false}
                showTag
            />
        </>
    );
}

const IfSym: SymComponent = BranchBase(["Yes", "No"]);
export default IfSym;
