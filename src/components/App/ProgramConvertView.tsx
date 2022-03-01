import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styled from "@mui/styles/styled";
import { FC } from "react";
import { EnableTarget } from "src/lib/fbeToProgram";
import UtilDialog, { useUtilDialog } from "./UtilDialog";

const StyledPre = styled("pre")({
    backgroundColor: "#222327",
    color: "white",
    padding: 8,
    margin: 0,
    minWidth: "100%",
    width: "fit-content",
});

export interface ProgramConvertViewProps {
    target: EnableTarget,
    children: string | null,
}
const ProgramConvertView: FC<ProgramConvertViewProps> = ({ children, target }) => {
    const [, dialogProps, {
        open: openDialog,
        close: closeDialog,
    }] = useUtilDialog({});
    const handleCopy = () => {
        if (navigator.clipboard && typeof children === "string") {
            var copyText = children;
            navigator.clipboard.writeText(copyText).then(() => {
                alert('コピーしました。');
            });
        } else {
            alert('対応していません。');
        }
    };
    if (typeof children !== "string") return <></>;
    return (
        <>
            <Button variant="contained" onClick={openDialog}>変換結果を見る</Button>

            <UtilDialog {...dialogProps}>
                <DialogTitle>{target}への変換結果</DialogTitle>
                <DialogContent sx={{ p: 0, minWidth: "70vw" }}>
                    <StyledPre>
                        {children}
                    </StyledPre>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCopy}>コピーする</Button>
                    <Button onClick={closeDialog}>閉じる</Button>
                </DialogActions>
            </UtilDialog>
        </>
    );
}
export default ProgramConvertView;

