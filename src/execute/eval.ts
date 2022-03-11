import {
    isBooleanArray,
    isBooleanArray2D,
    isNumberArray,
    isNumberArray2D,
    isStringArray,
    isStringArray2D,
    mustBoolean,
    mustNumber,
} from "src/lib/typechecker";
import jseEval from "jse-eval";
import { notImplementError } from "src/lib/notImplement";
const parse = jseEval.parse;
const evaluate = jseEval.evaluate;

type operand = any;
type unaryCallback = (a: operand) => operand;
type binaryCallback = (a: operand, b: operand) => operand;

const singleOperators: Record<string, unaryCallback> = {
    "+": (operand) => operand * 1,
    "-": (operand) => operand * -1,
};
const doubleOperators: Record<string, {
    priority: number,
    callback: binaryCallback,
}> = {
    "または": {
        priority: 1,
        callback: (left, right) =>
            mustBoolean(left) || mustBoolean(right),
    },
    "OR": {
        priority: 1,
        callback: (left, right) =>
            mustBoolean(left) || mustBoolean(right),
    },
    "or": {
        priority: 1,
        callback: (left, right) =>
            mustBoolean(left) || mustBoolean(right),
    },
    "かつ": {
        priority: 2,
        callback: (left, right) =>
            mustBoolean(left) && mustBoolean(right),
    },
    "AND": {
        priority: 2,
        callback: (left, right) =>
            mustBoolean(left) && mustBoolean(right),
    },
    "and": {
        priority: 2,
        callback: (left, right) =>
            mustBoolean(left) && mustBoolean(right),
    },
    "=": {
        priority: 6,
        callback: (left, right) =>
            left === right,
    },
    "<>": {
        priority: 6,
        callback: (left, right) =>
            left !== right,
    },
    "!=": {
        priority: 6,
        callback: (left, right) =>
            left !== right,
    },
    ">": {
        priority: 7,
        callback: (left, right) =>
            mustNumber(left) > mustNumber(right),
    },
    ">=": {
        priority: 7,
        callback: (left, right) =>
            mustNumber(left) >= mustNumber(right),
    },
    "<": {
        priority: 7,
        callback: (left, right) =>
            mustNumber(left) < mustNumber(right),
    },
    "<=": {
        priority: 7,
        callback: (left, right) =>
            mustNumber(left) <= mustNumber(right),
    },
    "^": {
        priority: 8,
        callback: (left, right) =>
            Math.pow(mustNumber(left), mustNumber(right)),
    },
    "+": {
        priority: 9,
        callback: (left, right) =>
            mustNumber(left) + mustNumber(right),
    },
    "-": {
        priority: 9,
        callback: (left, right) =>
            mustNumber(left) - mustNumber(right),
    },
    "*": {
        priority: 10,
        callback: (left, right) =>
            mustNumber(left) * mustNumber(right),
    },
    "/": {
        priority: 10,
        callback: (left, right) =>
            mustNumber(left) / mustNumber(right),
    },
    "%": {
        priority: 10,
        callback: (left, right) =>
            mustNumber(left) % mustNumber(right),
    },
};

export type VariableValue =
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | string[][]
    | number[][]
    | boolean[][];
export interface Variable {
    name: string;
    value: VariableValue;
}
export function isVariableValue(arg: any): arg is VariableValue {
    return (
        typeof arg === "string" ||
        typeof arg === "number" ||
        typeof arg === "boolean" ||
        isNumberArray(arg) ||
        isStringArray(arg) ||
        isBooleanArray(arg) ||
        isNumberArray2D(arg) ||
        isStringArray2D(arg) ||
        isBooleanArray2D(arg)
    );
}
export function variableValueToDispValue(value: VariableValue) {
    return String(value);
}

export function evalFormula(
    exp: string,
    variables: Variable[],
    funcs: { [k: string]: Function } = {}
): VariableValue {
    const _variables = variables.reduce((vars, v) => {
        vars[v.name] = v.value;
        return vars;
    }, {} as Record<string, unknown>);
    const ans = evaluate(
        parse(exp),
        {
            ..._variables,
            funcs,
        }
    );
    if (!isVariableValue(ans)) throw notImplementError();
    return ans;
}

(function initParser() {
    //演算子の登録
    jseEval.binops = {}
    jseEval.unops = {}
    Object.entries(singleOperators).forEach(([op, callback]) => {
        jseEval.addUnaryOp(op, callback);
    })
    Object.entries(doubleOperators).forEach(([op, { priority, callback }]) => {
        jseEval.addBinaryOp(op, priority, callback);
    })
})();

