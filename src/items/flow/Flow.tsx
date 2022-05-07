import { Box } from "@mui/material";
import Stack from "@mui/material/Stack";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { notImplementError } from "src/lib/error";
import { useSelectItemIds } from "src/redux/app/hooks";
import { getItem } from "src/redux/items/selectors";
import { isFlow, ItemId } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/hooks";
import { StoreState } from "src/redux/store";
import Arrow from "./Arrow";
import ChildSym from "./ChildSym";

export interface FlowComponentProps {
    flowId: ItemId;
    round?: boolean;
    bottomArrow?: boolean;
    selectable?: boolean;
    showTag?: boolean;
}

const FlowComponent: FC<FlowComponentProps> = ({
    flowId,
    round = false,
    bottomArrow = true,
    selectable = true,
    showTag = false,
}) => {
    const childrenItemIds = useSelector((state: StoreState) => {
        const item = getItem(flowId)(state);
        if (!isFlow(item)) {
            console.error(item, "is not flow");
            throw notImplementError();
        }
        return item.childrenItemIds;
    })
    const tag = useAppSelector(state => {
        const item = getItem(flowId)(state);
        if (!isFlow(item)) {
            console.error(item, "is not flow");
            throw notImplementError();
        }
        return item.tag;
    })
    const [, { selectOne }] = useSelectItemIds();
    const handleSelect = () => {
        selectOne(flowId)
    }
    const isSelect = useAppSelector(state => state.app.selectItemIds.includes(flowId))
    let children = <>
        {round ? <Arrow flowId={flowId} selectable={selectable} index={0} /> : ""}
        {childrenItemIds.map((itemId, i) => {
            return (
                <React.Fragment key={itemId}>

                    {i > 0 ? <Arrow flowId={flowId} selectable={selectable} index={i} /> : ""}

                    <ChildSym itemId={itemId} />

                </React.Fragment>
            );
        })}
        {round ? <Arrow flowId={flowId} selectable={selectable} index={childrenItemIds.length} arrow={bottomArrow} /> : ""}
    </>;
    if (childrenItemIds.length <= 0) children = <Arrow flowId={flowId} selectable={selectable} index={0} />;

    return (
        <Stack sx={{
            outline: `#1671d65c 4px ${isSelect ? "solid" : "none"}`,
            outlineOffset: "-2px",
            borderRadius: "0.25em",
        }}>
            {showTag &&
                <Box
                    id={flowId}
                    onClick={handleSelect}
                    sx={{
                        maxWidth: "90px",
                        wordWrap: "break-word",
                        minHeight: "1rem",
                        color: isSelect ? "blue" : "",
                    }}
                >
                    {tag}
                </Box>
            }
            {children}
        </Stack>
    );
};
export default React.memo(FlowComponent);



