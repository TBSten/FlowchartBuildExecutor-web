import { Box, Button, ButtonGroup } from "@mui/material";
import produce from "immer";
import { FC } from "react";
import SidebarContent from "src/components/App/SidebarContent";
import ErrorView from "src/components/util/ErrorView";
import { useScrollIntoView } from "src/lib/useScrollIntoView";
import { Item } from "src/redux/items/types";
import { useAppSelector } from "src/redux/root/operations";
import { useSp } from "src/style/media";
import { Runtime } from "./Runtime";


export type IOHistory = IOLog[];
export type IOLog = {
    type: "out";
    data: string[];
} | {
    type: "in" | "info";
    data: string;
};
export class TerminalRuntime extends Runtime {
    name = "terminal";
    ioHistory: IOHistory = [];
    constructor() {
        super();
        this.clearIOHistory.bind(this);
    }
    async initialize(items: Item[], flowIds: string[]): Promise<void> {
        super.initialize(items, flowIds);
        this.ioHistory = [];
    }
    async output(...data: string[]): Promise<void> {
        // await this.showMsgBox(data.join(" "));
        this.ioHistory = produce(this.ioHistory, draft => {
            draft.push({
                type: "out",
                data,
            })
        })
        this.flush();
    }
    async input(): Promise<string> {
        const data = await this.showInputBox("入力してください");
        this.ioHistory = produce(this.ioHistory, draft => {
            draft.push({
                type: "in",
                data,
            })
        })
        this.flush();
        return data;
    }
    clearIOHistory() {
        this.ioHistory = [];
        this.flush();
    }
    clearIOHistoryWithMessage() {
        this.ioHistory = [
            {
                type: "info",
                data: "(ログを削除しました)",
            }
        ];
        this.flush();
    }
    getViewComponent: FC<{}> = TerminalView;

}


const TerminalView: FC<{}> = () => {
    const runtime = useAppSelector(state => state.app.runtime);
    const ioHistory = useAppSelector(() =>
        (runtime instanceof TerminalRuntime) ?
            runtime.ioHistory : undefined);
    const [ref, scrollIntoView] = useScrollIntoView();
    const isSp = useSp();
    if (!(runtime instanceof TerminalRuntime) || !ioHistory) {
        return <ErrorView>ターミナルタブは実行タイプ「ターミナル」の時のみ使用可能です</ErrorView>
    }
    return (
        <SidebarContent title="出力と入力">
            <Box
                bgcolor="black"
                color="white"
                width="100%"
                height={isSp ? "30vh" : "50vh"}
                p={1}
                overflow="auto"
            >
                {ioHistory.map((ioLog, idx) =>
                    <Box key={idx} ref={ref}>
                        <Box color={
                            ioLog.type === "in" ? "green" :
                                ioLog.type === "out" ? "skyblue" :
                                    "yellow"
                        }
                            component="span">
                            {
                                ioLog.type === "in" ? "入力 >> " :
                                    ioLog.type === "out" ? "" :
                                        ""
                            }
                        </Box>
                        {ioLog.data ?? <ErrorView>UNKNOWN ERROR</ErrorView>}
                    </Box>
                )}
                {ioHistory.length <= 0 ? "(入出力があるとここに表示されます)" : ""}
            </Box>
            <ButtonGroup variant="outlined" >
                <Button onClick={() => runtime.clearIOHistoryWithMessage()}>ログを削除</Button>
                <Button onClick={scrollIntoView}>一番下へ</Button>
            </ButtonGroup>
        </SidebarContent>
    );
}

