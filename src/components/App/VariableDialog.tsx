import AppsIcon from "@mui/icons-material/Apps";
import TocIcon from "@mui/icons-material/Toc";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack/Stack";
import { FC, useState } from "react";
import VariablePane from "./VariablePane";


export type Mode = "memory" | "table";


export interface VariableDialogProps {
    open: boolean;
    onOpen: Function;
    onClose: Function;
}
const VariableDialog: FC<VariableDialogProps> = ({ open, onOpen, onClose }) => {
    const [mode, setMode] = useState<Mode>("memory");
    const [scale, setScale] = useState(1.0);
    const handleChangeMode = setMode;
    const handleChangeScale = setScale;

    return (
        <Dialog open={open} onClose={() => onClose} >

            <Head
                mode={mode}
                onChangeMode={handleChangeMode}
                scale={scale}
                onChangeScale={handleChangeScale}
            />

            <Box ></Box>
            <VariablePane mode={mode} scale={scale} />

            <Stack direction="row" justifyContent="flex-end">
                <Button onClick={() => onClose()}>閉じる</Button>
            </Stack>
        </Dialog>

    );
};
export default VariableDialog;




interface HeadProps {
    mode: Mode;
    onChangeMode: (mode: Mode) => any;

    scale: number;
    onChangeScale: (scale: number) => any;
}
const Head: FC<HeadProps> = ({ mode, onChangeMode, scale, onChangeScale }) => {
    const handleSelectMode = (mode: Mode) => () => onChangeMode(mode);
    return (
        <Stack direction="row" justifyContent="space-between">
            <Box>
                <IconButton
                    color={mode === "memory" ? "primary" : "default"}
                    onClick={handleSelectMode("memory")}
                >
                    <AppsIcon />
                </IconButton>
                <IconButton
                    color={mode === "table" ? "primary" : "default"}
                    onClick={handleSelectMode("table")}
                >
                    <TocIcon />
                </IconButton>
            </Box>
            <Box>
                <Tooltip title="拡大">
                    <IconButton onClick={() => onChangeScale(scale + 0.1)}>
                        <ZoomInIcon />
                    </IconButton>

                </Tooltip>
                <Tooltip title="縮小">
                    <IconButton onClick={() => onChangeScale(scale - 0.1)}>
                        <ZoomOutIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Stack>
    );
};
