import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AppsIcon from "@mui/icons-material/Apps";
import TocIcon from "@mui/icons-material/Toc";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { StoreState } from "src/redux/store";
import MemoryVariablePane from "./MemoryVariablePane";
import TableVariablePane from "./TableVariablePane";
import Stack from "@mui/material/Stack";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import Button from "@mui/material/Button";
import { Tooltip } from "@mui/material";
import { Mode } from "./VariableDialog";

export interface VariablePaneProps {
    mode: Mode;
    scale: number;
}

const VariablePane: FC<VariablePaneProps> = ({
    mode,
    scale,
}) => {
    const runtime = useSelector((state: StoreState) => state.app.runtime);

    if (!runtime) return <>実行タイプを選択してください</>;
    return (
        <Box sx={{ maxHeight: "75vh", overflow: "auto" }}>
            {mode === "memory" ? (
                <MemoryVariablePane scale={scale} />
            ) : mode === "table" ? (
                <TableVariablePane scale={scale} />
            ) : (
                ""
            )}
        </Box>
    );
};
export default VariablePane;
