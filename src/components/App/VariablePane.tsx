import Box from "@mui/material/Box";
import { FC } from "react";
import { useAppSelector } from "src/redux/root/hooks";
import MemoryVariablePane from "./MemoryVariablePane";
import TableVariablePane from "./TableVariablePane";
import { Mode } from "./VariableDialog";

export interface VariablePaneProps {
    mode: Mode;
    scale: number;
}

const VariablePane: FC<VariablePaneProps> = ({
    mode,
    scale,
}) => {
    const runtime = useAppSelector(state => state.app.runtime);

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
