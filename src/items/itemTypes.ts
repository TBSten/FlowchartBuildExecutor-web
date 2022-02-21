import { SymComponent, SymCreator } from "./types";
import { calcSymCreator } from "./calc/creator";
import CalcSym from "./calc/CalcSym";
import { terminalStartSymCreator } from "./terminalStart/creator";
import { terminalEndSymCreator } from "./terminalEnd/creator";
import TerminalStartSym from "./terminalStart/TerminalStartSym";
import TerminalEndSym from "./terminalEnd/TerminalEndSym";
import { outputSymCreator } from "./output/creator";
import OutputSym from "./output/OutputSym";
import { inputSymCreator } from "./input/creator";
import InputSym from "./input/InputSym";
import { whileSymCreator } from "./while/creator";
import WhileSym from "./while/WhileSym";
import { ifSymCreator } from "./if/creator";
import IfSym from "./if/IfSym";
import PrepareSym from "./prepare/PrepareSym";
import { prepareSymCreator } from "./prepare/creator";
import { processSymCreator } from "./process/creator";
import ProcessSym from "./process/ProcessSym";
import SwitchSym from "./switch/SwitchSym";
import { switchSymCreator } from "./switch/creator";
import { forSymCreator } from "./for/creator";
import ForSym from "./for/ForSym";

export const itemTypes: {
    [k: string]: {
        creator: SymCreator;
        component: SymComponent;
        addable: boolean;
        label: string;
    };
} = {
    "calc": {
        creator: calcSymCreator,
        component: CalcSym,
        addable: true,
        label: "計算",
    },
    "terminal-start": {
        creator: terminalStartSymCreator,
        component: TerminalStartSym,
        addable: false,
        label: "端子（開始）",
    },
    "terminal-end": {
        creator: terminalEndSymCreator,
        component: TerminalEndSym,
        addable: false,
        label: "端子（終了）",
    },
    "output": {
        creator: outputSymCreator,
        component: OutputSym,
        addable: true,
        label: "出力",
    },
    "input": {
        creator: inputSymCreator,
        component: InputSym,
        addable: true,
        label: "入力",
    },
    "while": {
        creator: whileSymCreator,
        component: WhileSym,
        addable: true,
        label: "繰り返し",
    },
    "for": {
        creator: forSymCreator,
        component: ForSym,
        addable: true,
        label: "回数繰り返し",
    },
    "if": {
        creator: ifSymCreator,
        component: IfSym,
        addable: true,
        label: "分岐",
    },
    "switch": {
        creator: switchSymCreator,
        component: SwitchSym,
        addable: true,
        label: "多分岐",
    },
    "prepare": {
        creator: prepareSymCreator,
        component: PrepareSym,
        addable: true,
        label: "準備",
    },
    "process": {
        creator: processSymCreator,
        component: ProcessSym,
        addable: true,
        label: "定義済み処理",
    },
};

export type ItemType = keyof typeof itemTypes;
export const addableItemTypes = Object.entries(itemTypes)
    .filter(([, { addable }]) => addable)
    .map(([itemType]) => itemType);
