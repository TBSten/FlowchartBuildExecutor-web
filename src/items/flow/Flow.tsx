import Stack from "@mui/material/Stack";
import React, { FC } from "react";
import { useFlow } from "src/redux/items/operations";
import { ItemId } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/operations";
import Arrow from "./Arrow";
import ChildSym from "./ChildSym";

export interface FlowComponentProps {
    flowId: ItemId;
    round?: boolean;
    bottomArrow?: boolean;
    selectable?: boolean;
}

const FlowComponent: FC<FlowComponentProps> = ({
    flowId,
    round = false,
    bottomArrow = true,
    selectable = true,
}) => {
    const [flow] = useFlow(flowId);
    const isSelect = useAppSelector(state => state.app.selectItemIds.includes(flowId))
    let children = <>
        {round ? <Arrow flowId={flow.itemId} selectable={selectable} index={0} /> : ""}
        {flow.childrenItemIds.map((itemId, i) => {
            return (
                <React.Fragment key={itemId}>

                    {i > 0 ? <Arrow flowId={flow.itemId} selectable={selectable} index={i} /> : ""}

                    <ChildSym itemId={itemId} />

                </React.Fragment>
            );
        })}
        {round ? <Arrow flowId={flow.itemId} selectable={selectable} index={flow.childrenItemIds.length} arrow={bottomArrow} /> : ""}
    </>;
    if (flow.childrenItemIds.length <= 0) children = <Arrow flowId={flow.itemId} selectable={selectable} index={0} />;

    return (
        <Stack sx={{
            outline: `#1671d65c 4px ${isSelect ? "solid" : "none"}`,
            outlineOffset: "-2px",
            borderRadius: "0.25em",
        }}>
            {children}
        </Stack>
    );
};
export default React.memo(FlowComponent);



