export function notImplement(msg: string = "") {
    throw new Error("not implement ! " + msg);
}

export function notImplementError(msg: string = "") {
    return new Error("not implement ! " + msg);
}

export class ShowableError extends Error {
    debugMsg: string;
    showMsg: string;
    constructor(debugMsg: string, showMsg: string) {
        super(debugMsg);
        this.debugMsg = debugMsg;
        this.showMsg = showMsg;
    }
}

export function showableError(debug: string = "", show: string = "不明なエラー") {
    return new ShowableError(debug, show);
}

