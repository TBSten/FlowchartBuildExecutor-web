
import { store } from "src/redux/store";
import { addLogs as addLogToStore } from "src/redux/app/actions";
import { notImplement } from "./error";


export interface Log {
    message: any,
    level: number,
}

function addLog(log: Log) {
    store.dispatch(addLogToStore({ log }));
}

function outputConsole(type: "info" | "log" | "error" | "warn", ...args: any[]) {
    console[type](...args)
}

function toLogMessage(...args: any[]) {
    return args.reduce((ans, arg) => {
        switch (typeof arg) {
            case "object":
                return ans + `${JSON.stringify(arg)} `;
            case "function":
                return ans + `[Function : ${arg}] `;
            default:
                return ans + `${arg} `;
        }
    }, "");
}

/**
 * 通常の出力です。`console.log`や`console.info`と同等のレベルです
 */
function info(...args: any[]) {
    // console.info(...args);
    outputConsole("info", ...args)
    addLog({
        message: toLogMessage(...args),
        level: 0,
    });
}
/**
 * 警告を出力します。`console.warn`と同等のレベルです
 */
function warn(...args: any[]) {
    // console.warn(...args);
    outputConsole("warn", ...args)
    addLog({
        message: toLogMessage(...args),
        level: 10,
    });
}
/**
 * エラーを出力します。`console.error`と同等のレベルです
 */
function error(...args: any[]) {
    // console.error(...args);
    outputConsole("error", ...args)
    addLog({
        message: toLogMessage(...args),
        level: 100,
    });
}

/**
 * 致命的なエラーを出力します。`console.error`とよりも重要なレベルです
 */
function fatal(...args: any[]) {
    // console.error(...args);
    outputConsole("error", ...args)
    addLog({
        message: toLogMessage(...args),
        level: 1000,
    });
}

export const logger = {
    info,
    warn,
    error,
    fatal,
    log: info,
};

export function sendLog() {
    const logs = store.getState();
    console.log("sending", logs)
    notImplement();
}
