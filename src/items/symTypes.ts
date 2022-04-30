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
import { calcExecute } from "./calc/execute";
import { terminalStartExecute } from "./terminalStart/execute";
import { terminalEndExecute } from "./terminalEnd/execute";
import { outputExecute } from "./output/execute";
import { inputExecute } from "./input/execute";
import { whileExecute } from "./while/execute";
import { forExecute } from "./for/execute";
import { ifExecute } from "./if/execute";
import { switchExecute } from "./switch/execute";
import { prepareExecute } from "./prepare/execute";
import { processExecute } from "./process/execute";
import { DefaultOptionEditor } from "./option";
import SwitchOptionEditor from "./switch/SwitchOptionEditor";


export const symTypes = {
    "calc": {
        creator: calcSymCreator,
        component: CalcSym,
        addable: true,
        label: "計算",
        execute: calcExecute,
        optionEditor: DefaultOptionEditor,
    },
    "terminal-start": {
        creator: terminalStartSymCreator,
        component: TerminalStartSym,
        addable: false,
        label: "端子（開始）",
        execute: terminalStartExecute,
        optionEditor: DefaultOptionEditor,
    },
    "terminal-end": {
        creator: terminalEndSymCreator,
        component: TerminalEndSym,
        addable: false,
        label: "端子（終了）",
        execute: terminalEndExecute,
        optionEditor: DefaultOptionEditor,
    },
    "output": {
        creator: outputSymCreator,
        component: OutputSym,
        addable: true,
        label: "出力",
        execute: outputExecute,
        optionEditor: DefaultOptionEditor,
    },
    "input": {
        creator: inputSymCreator,
        component: InputSym,
        addable: true,
        label: "入力",
        execute: inputExecute,
        optionEditor: DefaultOptionEditor,
    },
    "while": {
        creator: whileSymCreator,
        component: WhileSym,
        addable: true,
        label: "繰り返し",
        execute: whileExecute,
        optionEditor: DefaultOptionEditor,
    },
    "for": {
        creator: forSymCreator,
        component: ForSym,
        addable: true,
        label: "回数繰り返し",
        execute: forExecute,
        optionEditor: DefaultOptionEditor,
    },
    "if": {
        creator: ifSymCreator,
        component: IfSym,
        addable: true,
        label: "分岐",
        execute: ifExecute,
        optionEditor: DefaultOptionEditor,
    },
    "switch": {
        creator: switchSymCreator,
        component: SwitchSym,
        addable: true,
        label: "多分岐",
        execute: switchExecute,
        optionEditor: SwitchOptionEditor,
    },
    "prepare": {
        creator: prepareSymCreator,
        component: PrepareSym,
        addable: true,
        label: "準備",
        execute: prepareExecute,
        optionEditor: DefaultOptionEditor,
    },
    "process": {
        creator: processSymCreator,
        component: ProcessSym,
        addable: true,
        label: "定義済み処理",
        execute: processExecute,
        optionEditor: DefaultOptionEditor,
    },
} as const;


const symTypesKeys = Object.keys(symTypes);

export type SymType = (keyof typeof symTypes);
export function isSymType(arg: any): arg is SymType {
    return (
        typeof arg === "string" &&
        symTypesKeys.includes(arg)
    );
}

export const addableItemTypes = Object.entries(symTypes)
    .filter(([, { addable }]) => addable)
    .map(([itemType]) => itemType);


