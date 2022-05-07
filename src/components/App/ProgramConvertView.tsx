import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Highlight, { defaultProps, Language, Prism as ReactPrism } from "prism-react-renderer";
import PrismDarkTheme from "prism-react-renderer/themes/vsDark";
import Prism from "prismjs";
import { FC, useEffect } from "react";
import { EnableTarget } from "src/lib/fbeToProgram";
import UtilDialog, { useUtilDialog } from "./UtilDialog";


declare global {
    namespace NodeJs {
        interface Global {
            Prism: any
        }
    }
}
declare global {
    interface Window {
        Prism: any
    }
}
; (typeof global !== "undefined" ? global : window).Prism = ReactPrism
require("prismjs/components/prism-java")

export interface ProgramConvertViewProps {
    target: EnableTarget,
    children: string | null,
}
const ProgramConvertView: FC<ProgramConvertViewProps> = ({ children, target }) => {
    const [, dialogProps, {
        open: openDialog,
        close: closeDialog,
    }] = useUtilDialog({});
    useEffect(() => {
        Prism.highlightAll();
    }, [])
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
                    <Highlight {...defaultProps}
                        code={children ?? ""}
                        theme={PrismDarkTheme}
                        language={target as Language}
                    >
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre
                                className={className}
                                style={{
                                    ...style,
                                    padding: 8,
                                    margin: 0,
                                    width: "fit-content",
                                    minWidth: "100%",
                                }}
                            >
                                {tokens.map((line, i) => (
                                    <div {...getLineProps({ line, key: i })}>
                                        {line.map((token, key) => (
                                            <span {...getTokenProps({ token, key })} />
                                        ))}
                                    </div>
                                ))}
                            </pre>
                        )}
                    </Highlight>
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

