import Stack from "@mui/material/Stack";
import { FC, } from "react";
import { useFlow, } from "src/redux/items/operations";
import { ItemId } from "src/redux/items/types";
import Arrow from "./Arrow";
import React from "react";
import ChildSym from "./ChildSym";
import { StoreState } from "src/redux/store";
import { useSelector } from "react-redux";

export interface CompFlowProps {
    flowId: ItemId;
    round?: boolean;
    bottomArrow?: boolean;
    selectable?: boolean;
}

const CompFlow: FC<CompFlowProps> = ({
    flowId,
    round = false,
    bottomArrow = true,
    selectable = true,
}) => {
    const [flow] = useFlow(flowId);
    const isSelect = useSelector((state: StoreState) => state.app.selectItemIds.includes(flowId))
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
export default React.memo(CompFlow);



