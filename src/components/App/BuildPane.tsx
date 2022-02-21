import React, { FC, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import CompFlow from "src/items/flow/Flow";
import { useFlows } from "src/redux/meta/operations";
import { useSelectItemIds, useZoom } from "src/redux/app/operations";
import { useSp } from "src/style/media";
import { ItemId } from "src/redux/items/types";
import { useSelector } from "react-redux";
import { isSelecting } from "src/redux/app/selectors";

export interface BuildPaneProps { }

const BuildPane: FC<BuildPaneProps> = () => {
    console.log("render build pane");
    const [flowIds] = useFlows();
    const [zoom, setZoom] = useZoom();
    const isSp = useSp();
    useEffect(() => {
        if (isSp) {
            setZoom(0.55);
        } else {
            setZoom(1.0)
        }
    }, [isSp, setZoom]);
    return (
        <Box
            sx={{
                width: "fit-content",
                height: "fit-content",
                maxWidth: "100%",
                maxHeight: "100%",
                minWidth: "20vw",
                minHeight: "20vh",
                overflow: "auto",
                backgroundColor: "#dbdbdb",
                px: "75vw",
                py: "75vh",
            }}
        >
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    overflow: "visible",
                    width: "fit-content%",
                    height: "fit-content",
                    transform: `scale(${zoom})`,
                    transition: "0.3s"
                }}
            >
                {flowIds.map((flowId) => {
                    return (
                        <FlowContainer flowId={flowId} />
                    )
                })}
            </Stack>
        </Box>
    );
};
export default React.memo(BuildPane);


const FlowContainer: FC<{ flowId: ItemId }> = ({ flowId }) => {
    const [, { selectOne }] = useSelectItemIds();
    const isSelect = useSelector(isSelecting(flowId))
    const handleSelect = () => {
        selectOne(flowId);
    };
    return (
        <Box>
            <Box onClick={handleSelect} >
                <SelectAllIcon color={isSelect ? "primary" : "inherit"} />
            </Box>
            <CompFlow key={flowId} flowId={flowId} selectable={false} />
        </Box>

    );
};


