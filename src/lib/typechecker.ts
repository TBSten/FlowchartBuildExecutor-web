
export function isNumber(arg: any): arg is number {
    return typeof arg === "number" || typeof arg === "bigint";
}
export function isString(arg: any): arg is string {
    return typeof arg === "string";
}
export function isBoolean(arg: any): arg is boolean {
    return typeof arg === "boolean";
}
export function isNumberArray(arg: any): arg is number[] {
    return Array.isArray(arg) && isNumber(arg[0]);
}
export function isStringArray(arg: any): arg is string[] {
    return Array.isArray(arg) && isString(arg[0]);
}
export function isBooleanArray(arg: any): arg is boolean[] {
    return Array.isArray(arg) && isBoolean(arg[0]);
}
export function isNumberArray2D(arg: any): arg is number[] {
    return Array.isArray(arg) && Array.isArray(arg[0]) && isNumber(arg[0][0]);
}
export function isStringArray2D(arg: any): arg is string[] {
    return Array.isArray(arg) && Array.isArray(arg[0]) && isString(arg[0][0]);
}
export function isBooleanArray2D(arg: any): arg is boolean[] {
    return Array.isArray(arg) && Array.isArray(arg[0]) && isBoolean(arg[0][0]);
}


export function mustNumber(arg: any): number {
    if (!isNumber(arg)) {
        console.log(arg);

        throw new TypeError(`${arg} must be number !`);
    }
    return arg;
}
export function mustString(arg: any): string {
    if (!isString(arg)) {
        console.log(arg);

        throw new TypeError(`${arg} must be string !`);
    }
    return arg;
}
export function mustBoolean(arg: any): boolean {
    if (!isBoolean(arg)) {
        console.log(arg);

        throw new TypeError(`${arg} must be boolean !`);
    }
    return arg;
}
