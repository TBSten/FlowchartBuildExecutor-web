import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import React, { FC, useEffect, useRef } from "react";
import { useChange, useMode, useSelectItemIds } from "src/redux/app/hooks";
import { useFlow, useItemOperations } from "src/redux/items/hooks";
import { Item, ItemId } from "src/redux/items/types";
import { config } from "../base/SymBase";
import { calcSymCreator } from "../calc/creator";
import { makeItemId } from "../util";

const width = config.size.width;
const height = config.size.height / 2;

export interface ArrowProps {
    flowId: ItemId;
    index: number;
    arrow?: boolean;
    selectable: boolean;
}

const top = {
    x: width / 2,
    y: 0
};
const bottom = {
    x: width / 2,
    y: height
};

const Arrow: FC<ArrowProps> = ({ flowId, index, arrow = true, selectable }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [flow, { set: setFlow }] = useFlow(flowId);
    const { setItem } = useItemOperations();
    const [mode] = useMode();
    const [, { selectOne }] = useSelectItemIds();
    const { notifyChange } = useChange();
    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
            ctx.fillStyle = config.color.back;
            ctx.strokeStyle = config.color.fore;
            ctx.lineWidth = config.size.lineWidth;
            ctx.beginPath();
            ctx.moveTo(top.x, top.y);
            ctx.lineTo(bottom.x, bottom.y);
            // if (arrow) {
            //     // ctx.lineTo(left.x,left.y);
            //     // ctx.moveTo(bottom.x,bottom.y);
            //     // ctx.lineTo(right.x,right.y);
            // }
            ctx.closePath();
            ctx.stroke();
        }
    }, [mode, arrow]);
    const handleAddSym = () => {
        const newItemId = makeItemId();
        const newItem = calcSymCreator(newItemId, flowId);
        const childrenItemIds = [...flow.childrenItemIds];
        childrenItemIds.splice(index, 0, newItemId);
        setItem(newItem);
        setFlow({
            ...flow,
            childrenItemIds,
        } as Item);
        selectOne(newItemId);
        notifyChange();
    };
    const handleSelect = () => {
        if (selectable) selectOne(flowId);
    };
    return (
        <Box sx={{
            width,
            height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100
        }}
            onClick={handleSelect}
        >

            {mode === "edit" ?
                <IconButton onClick={handleAddSym}>
                    <AddIcon />
                </IconButton>
                :
                <canvas {...{ width, height }} ref={ref} />
            }

        </Box>
    );
};
export default React.memo(Arrow);
