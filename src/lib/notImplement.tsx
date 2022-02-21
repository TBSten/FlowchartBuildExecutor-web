export function notImplement(msg: string = "") {
    throw new Error("not implement ! " + msg);
}

export function notImplementError(msg: string = "") {
    return new Error("not implement ! " + msg);
}
