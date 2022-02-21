import { ItemExecute } from "./types";
import { calcExecute } from "./calc/execute";
import { flowExecute } from "./flow/execute";
import { terminalStartExecute } from "./terminalStart/execute";
import { terminalEndExecute } from "./terminalEnd/execute";
import { outputExecute } from "./output/execute";
import { inputExecute } from "./input/execute";
import { whileExecute } from "./while/execute";
import { ifExecute } from "./if/execute";
import { prepareExecute } from "./prepare/execute";
import { processExecute } from "./process/execute";
import { switchExecute } from "./switch/execute";
import { forExecute } from "./for/execute";

/**
 * ### usage
 * ```tsx
 * const someItem = ... ;
 * const execute = executes[someItem.itemType];
 * execute({items:someItem,runtimeData,runtime})
 * ```
 */
const executes: {
    [key: string]: ItemExecute
} = {
    "calc": calcExecute,
    "flow": flowExecute,
    "terminal-start": terminalStartExecute,
    "terminal-end": terminalEndExecute,
    "output": outputExecute,
    "input": inputExecute,
    "while": whileExecute,
    "if": ifExecute,
    "prepare": prepareExecute,
    "process": processExecute,
    "switch": switchExecute,
    "for": forExecute,
};

export default executes;

