import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import produce from "immer";
import { ReactNode } from "react";
import { evalFormula, evalFormulaAsVariableValue, isVariableValue, Variable, VariableValue } from "src/execute/eval";
// import _ from "lodash" ;
import executes from "src/items/execute";
import { getOption } from "src/items/option";
import { logger } from "src/lib/logger";
import { notImplement, notImplementError } from "src/lib/notImplement";
import { sleep } from "src/lib/sleep";
import { mustNumber } from "src/lib/typechecker";
import { setRuntime } from "src/redux/app/actions";
import { isFlow, isSym, Item, ItemId } from "src/redux/items/types";
import { store } from "src/redux/store";
import { RuntimeTab } from "./types";



type VariableHistoryLine = (Variable[] & { changedName: string });
type VariableHistory = VariableHistoryLine[];
type TempData = {
    [k: string]: unknown;
}

export abstract class Runtime {
    items: Item[];
    flowIds: ItemId[];
    executingItemId: ItemId | null;
    executingItemIds: ItemId[];

    status: "BEFORE_START" | "EXECUTING" | "SUCCESS" | "ERROR" | "STOPPED";
    tabs: RuntimeTab[];
    dialog = {
        open: false,
        content: null as ReactNode,
        onClose: () => { },
    };
    /**
     * 0-10の間で実行速度を指定（大きい方が早い）
     */
    speed: number;
    delay: number;

    variables: Variable[];
    variableHistory: VariableHistory;
    tempData: TempData;

    buildInFunctions: {
        [k: string]: Function
    };
    constantsVariables: {
        [k: string]: unknown
    };

    constructor() {
        this.items = [];
        this.flowIds = [];
        this.executingItemId = null;
        this.executingItemIds = [];
        this.status = "BEFORE_START";
        this.variables = [];

        this.tabs = [];

        this.speed = 5.0;
        this.delay = 0.0;

        this.variables = [];
        this.variableHistory = [];
        this.tempData = {};

        this.constantsVariables = {
            "FBEバージョン": "2.1",
            "E": Math.E,
            "PI": Math.PI,
            "円周率": Math.PI,
        };
        this.buildInFunctions = {
            // 計算関数
            "random": (min = 0, max = 1) => Math.random() * (max - min) + min,
            "乱数": (min = 0, max = 1) => Math.random() * (max - min) + min,

            "floor": (num: number) => Math.floor(num),
            "rounddown": (num: number) => Math.floor(num),
            "切り捨て": (num: number) => Math.floor(num),

            "ceil": (num: number) => Math.ceil(num),
            "ceiling": (num: number) => Math.ceil(num),
            "roundup": (num: number) => Math.ceil(num),
            "切り上げ": (num: number) => Math.ceil(num),

            "round": (num: number) => Math.round(num),
            "四捨五入": (num: number) => Math.round(num),

            "pow": (a: number, b: number) => Math.pow(a, b),

            "int": (num: any) => parseInt(num),
            "整数": (num: any) => parseInt(num),

            "sqrt": (num: number) => Math.sqrt(mustNumber(num)),
            "平方根": (num: number) => Math.sqrt(mustNumber(num)),

            "sin": (num: unknown) => Math.sin(mustNumber(num)),
            "cos": (num: unknown) => Math.cos(mustNumber(num)),
            "tan": (num: unknown) => Math.tan(mustNumber(num)),

            "log2": (num: unknown) => Math.log2(mustNumber(num)),
            "log10": (num: unknown) => Math.log2(mustNumber(num)),

            "max": (...nums: number[]) => Math.max(...nums),
            "min": (...nums: number[]) => Math.min(...nums),

            "degToRad": (deg: unknown) => mustNumber(deg) * (Math.PI / 180),
            "radToDeg": (rad: unknown) => mustNumber(rad) / (Math.PI / 180),

            // 機能的関数
            "sleep": async (millis: number) => this.sleep(millis),
        };

        this.closeDialog.bind(this);
        this.getViewComponent.bind(this);

    }

    async initialize(items: Item[], flowIds: ItemId[]) {
        this.items = items;
        this.flowIds = flowIds;
        this.executingItemId = null;
        this.executingItemIds = [];
        this.status = "BEFORE_START";
        this.variables = [];
        this.variableHistory = [];
        this.tempData = {};

        const firstFlowId = this.flowIds[0];
        this.executingItemIds.push(firstFlowId);
        this.executingItemId = firstFlowId;

        logger.log("initialize", this);

        this.flush();
    }
    async executeNext() {
        if (this.isFinished()) {
            //終了後に実行
            logger.error("すでに終了しています");
            notImplement();
        }
        try {
            const exeItemId = this.executingItemIds[0];
            const exeItem = this.getItem(exeItemId);
            this.executingItemId = exeItemId;
            this.flush();
            if (exeItem) {
                if (this.status === "BEFORE_START") {
                    this._handleStart();
                    this.status = "EXECUTING";
                }
                logger.info("execute", exeItem.itemType);
                //先頭を削除
                this.executingItemIds = this.executingItemIds.slice(1);
                //exeItemを実行
                const result = await this.executeItem(exeItem);
                if (result?.skip) {
                    await this.executeNext();
                }
                this.flush();
            } else {
                logger.error(exeItemId, exeItem);
                throw new Error(`invalid execute item`);
            }
            if (this.executingItemIds.length <= 0) {
                //もう実行するものがない
                this.status = "SUCCESS";
                this._handleEnd();
                logger.info("終了しました");
                return;
            }
        } catch (e) {
            logger.error(e);
            this.status = "ERROR";
            await this.showMsgBox(`エラーが発生しました。`);
        }
    }
    async executeAll() {
        if (this.isFinished()) {
            //終了後に実行
            logger.error("すでに終了しています");
            notImplement();
            return;
        }
        if (this.status === "EXECUTING") {
            logger.error("実行中だったので実行できませんでした");
            return;
        }
        if (this.delay > 0) {
            await this.sleep(this.delay * 1000);
        }
        const start = new Date();
        while (!this.isFinished()) {
            await this.executeNext();
            const ms = speedToMillis(this.speed);
            if (ms > 0) await this.sleep(ms);
        }
        const time = new Date().valueOf() - start.valueOf();
        logger.log("took", time, "ms");
    }
    async stop() {
        this.status = "STOPPED";
    }
    async executeItem(item: Item) {
        const execute = executes[item.itemType];
        if (execute instanceof Function) {
            logger.log(">>> execute start", item.itemType);
            const exeResult = await execute({
                item: item,
                runtime: this,
            });
            this._handleExecute();
            logger.log(">>> execute end", item.itemType);
            return exeResult;
        }
    }

    getItem(itemId: ItemId) {
        return this.items.find((item) => item.itemId === itemId);
    }
    abstract output(...data: string[]): Promise<void>;
    abstract input(): Promise<string>;

    isFinished() {
        return (
            this.status === "SUCCESS" ||
            this.status === "ERROR" ||
            this.status === "STOPPED"
        );
    }

    showDialog(content: (close: () => void) => ReactNode) {
        const handleCloseDialog = () => this.closeDialog();
        return new Promise<void>((resolve, reject) => {
            this.dialog.content = content(handleCloseDialog);
            this.dialog.onClose = () => {
                resolve();
            };
            this.dialog.open = true;
            this.flush();
        });
    }
    closeDialog() {
        this.dialog.open = false;
        this.dialog.onClose();
        this.flush();
    }
    async showMsgBox(msg: string) {
        await this.showDialog((close) => (
            <>
                <DialogContent>{msg}</DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={close}>
                        OK
                    </Button>
                </DialogActions>
            </>
        ));
    }
    async showConfirmBox(msg: string) {
        let flg = true;
        await this.showDialog((close) => {
            const handleCancel = () => {
                flg = false;
                close();
            };
            const handleOk = () => close();
            return (
                <>
                    <DialogContent>{msg}</DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={handleCancel}>
                            キャンセル
                        </Button>
                        <Button variant="contained" onClick={handleOk}>
                            OK
                        </Button>
                    </DialogActions>
                </>
            );
        });
        return flg;
    }
    async showInputBox(msg: string = "") {
        return prompt(msg) ?? "";
    }
    flush() {
        store.dispatch(
            setRuntime({
                runtime: this,
            })
        );
    }

    async eval(exp: string) {
        return evalFormulaAsVariableValue(
            exp,
            this._getAllVariables(),     //constants variablesを追加したい
            this.buildInFunctions,
        );
    }
    async dangerousEval(exp: string) {
        return evalFormula(
            exp,
            this._getAllVariables(),     //constants variablesを追加したい
            this.buildInFunctions,
        );
    }
    _getAllVariables(): Variable[] {
        const constants = (Object.entries(this.constantsVariables).map(([name, value]) => {
            if (!isVariableValue(value)) throw notImplementError(`invalid constant variable : ${name} = ${value}`);
            return {
                name, value
            }
        }))
        const vars: Variable[] = [
            ...this.variables,
            ...constants,
        ];
        return vars;
    }
    getVariable(name: string) {
        return this.variables.find((v) => v.name === name);
    }
    setVariable(name: string, value: VariableValue) {
        logger.log("setVariable", name, "to", value);
        //現在の変数一覧の更新
        // const v = this.getVariable(name);
        this.variables = produce(this.variables, draft => {
            let idx = draft.findIndex(v => v.name === name)
            if (idx < 0) idx = draft.length;
            draft[idx] = { name, value, };
        });
        //履歴の更新
        this.variableHistory = produce(this.variableHistory, draft => {
            const newHistory = Object.assign(
                Object.create(this.variables),
                { changedName: name, }
            );
            draft.push(newHistory)
        });
    }
    setTempData(key: string, value: unknown) {
        this.tempData[key] = value;
    }
    getTempData(key: string): unknown {
        return this.tempData[key];
    }
    getProcessFlowId(name: string): ItemId | undefined {
        const flowId = this.flowIds.find(flowId => {
            const item = this.getItem(flowId);
            if (!isFlow(item)) return false;
            const first = this.getItem(item.childrenItemIds[0]);
            if (!isSym(first)) return false;
            const option = getOption(first, "テキスト");
            return option?.value === name;
        });
        return flowId;
    }

    getViewComponent: React.FC<{}> = () => {
        return <></>;
    }

    _handleStart() {
        this.onStart();
    }
    _handleEnd() {
        this.onEnd();
        this.showMsgBox("実行終了しました");
    }
    _handleExecute() {
        this.onExecute();
    }

    async sleep(ms: number) {
        await sleep(ms);
    }

    onStart() { }
    onEnd() { }
    onExecute() { }
}

/**
 * |speed   |ms     |
 * |---|---|
 * |0       |2000   |
 * |10      |0      |
 *
 * ms = -200*speed+2000
 */
function speedToMillis(speed: number) {
    return Math.max(-200 * speed + 2000, 0);
}

