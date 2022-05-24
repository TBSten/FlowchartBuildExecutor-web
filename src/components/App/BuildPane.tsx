import SelectAllIcon from "@mui/icons-material/SelectAll";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import React, { FC } from "react";
import { useSavedZoom } from "src/format/browser";
import CompFlow from "src/items/flow/Flow";
import { useMode, useSelectItemIds } from "src/redux/app/hooks";
import { isSelecting } from "src/redux/app/selectors";
import { useFlow } from "src/redux/items/hooks";
import { ItemId } from "src/redux/items/types";
import { useTopFlows } from "src/redux/meta/hooks";
import { useAppSelector } from "src/redux/root/hooks";

export interface BuildPaneProps {
    disablePadding?: boolean;
}

export const BUILDPANE_ID = "fbe-build-pane";

const BuildPane: FC<BuildPaneProps> = ({ disablePadding = false }) => {
    const [flowIds] = useTopFlows();
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
                px: !disablePadding ? "80vw" : 0,
                py: !disablePadding ? "70vh" : 0,

            }}
        >
            <Box id={BUILDPANE_ID}>
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
                            <FlowContainer
                                key={flowId}
                                flowId={flowId}
                            />
                        )
                    })}
                </Stack>
            </Box>
        </Box>

    );
};
export default React.memo(BuildPane);


const FlowContainer: FC<{ flowId: ItemId }> = ({ flowId }) => {
    const [flow] = useFlow(flowId);
    const [, { selectOne }] = useSelectItemIds();
    const isSelect = useAppSelector(isSelecting(flowId))
    const [mode] = useMode();
    const handleSelect = () => {
        selectOne(flowId);
    };
    if (!flow) return <>???</>;
    return (
        <Box>
            {mode === "edit" ?
                <Box onClick={handleSelect} >
                    <SelectAllIcon color={isSelect ? "primary" : "inherit"} />
                </Box>
                : null}
            <CompFlow flowId={flowId} selectable={false} />
        </Box>
    );
};


