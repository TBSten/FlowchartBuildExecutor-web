import SelectAllIcon from "@mui/icons-material/SelectAll";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import React, { FC } from "react";
import { useSavedZoom } from "src/format/browser";
import CompFlow from "src/items/flow/Flow";
import { useMode, useSelectItemIds } from "src/redux/app/hooks";
import { isSelecting } from "src/redux/app/selectors";
import { ItemId } from "src/redux/items/types";
import { useFlows } from "src/redux/meta/hooks";
import { useAppSelector } from "src/redux/root/hooks";

export interface BuildPaneProps { }

const BuildPane: FC<BuildPaneProps> = () => {
    const [flowIds] = useFlows();
    const [zoom] = useSavedZoom();
    // const [mode] = useMode();
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
                px: "80vw",
                py: "70vh",
            }}
        >
            <Box id="fbe-build-pane">
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        overflow: "visible",
                        width: "fit-content%",
                        height: "fit-content",
                        transformOrigin: "top left",
                        transform: `scale(${zoom})`,
                        transition: "0.3s"
                    }}
                >
                    {flowIds.map((flowId) => {
                        return (
                            <FlowContainer key={flowId} flowId={flowId} />
                        )
                    })}
                </Stack>
            </Box>
        </Box>

    );
};
export default React.memo(BuildPane);


const FlowContainer: FC<{ flowId: ItemId }> = ({ flowId }) => {
    const [, { selectOne }] = useSelectItemIds();
    const isSelect = useAppSelector(isSelecting(flowId))
    const [mode] = useMode();
    const handleSelect = () => {
        selectOne(flowId);
    };
    return (
        <Box>
            {mode === "edit" ?
                <Box onClick={handleSelect} >
                    <SelectAllIcon color={isSelect ? "primary" : "inherit"} />
                </Box>
                : null}
            <CompFlow key={flowId} flowId={flowId} selectable={false} />
        </Box>

    );
};


