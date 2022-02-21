// export type Token = string;
// export type EvalValue = number | string | boolean;
// type Evaler = (params: Token[]) => EvalValue;

// const eq = (params: EvalValue[]) => params[0] === params[1];
// const nEq = (params: EvalValue[]) => params[0] !== params[1];
// const sm = (params: EvalValue[]) => params[0] < params[1];
// const lg = (params: EvalValue[]) => params[0] > params[1];
// const add = (params: EvalValue[]) => {
//     const left = params[0];
//     const right = params[1];
//     if (typeof left === "number" && typeof right === "number")
//         return left + right;
//     if (typeof left === "string" && typeof right === "number")
//         return left + right;
//     if (typeof left === "number" && typeof right === "string")
//         return left + right;
//     if (typeof left === "string" && typeof right === "string")
//         return left + right;
//     throw new Error("not implemented !!!!!");
// };
// const sub = (params: EvalValue[]) => {
//     const left = params[0];
//     const right = params[1];
//     if (typeof left === "number" && typeof right === "number")
//         return left - right;
//     throw new Error("not implemented !!!!!");
// };
// const multi = (params: EvalValue[]) => {
//     const left = params[0];
//     const right = params[1];
//     if (typeof left === "number" && typeof right === "number")
//         return left * right;
//     throw new Error("not implemented !!!!!");
// };
// const div = (params: EvalValue[]) => {
//     const left = params[0];
//     const right = params[1];
//     if (typeof left === "number" && typeof right === "number")
//         return left / right;
//     throw new Error("not implemented !!!!!");
// };
// const mod = (params: EvalValue[]) => {
//     const left = params[0];
//     const right = params[1];
//     if (typeof left === "number" && typeof right === "number")
//         return left % right;
//     throw new Error("not implemented !!!!!");
// };
// const not = (params: EvalValue[]) => !params[0];

// class Operator {
//     static LEFT = "LEFT";
//     static RIGHT = "RIGHT";
//     static instances = [] as Operator[];
//     pattern: string;
//     term: number;
//     join: string;
//     e: Evaler;
//     constructor(pattern: string, term: number, join: string, e: Evaler) {
//         this.pattern = pattern;
//         this.term = term;
//         this.join = join;
//         this.e = e;
//         Operator.instances.push(this);
//     }
//     eval(params: Token[]) {
//         return this.e(params);
//     }
// }
// class Lt {
//     pattern: any;
//     ltToToken: any;
//     tokenToLt: any;
//     constructor(
//         pattern: string,
//         ltToToken: (lt: EvalValue) => Token,
//         tokenToLt: (t: Token) => EvalValue
//     ) {
//         this.pattern = pattern;
//         this.ltToToken = ltToToken;
//         this.tokenToLt = tokenToLt;
//     }
// }
// //演算子
// const opes = [
//     [
//         new Operator("==", 2, Operator.LEFT, eq),
//         new Operator("!=", 2, Operator.LEFT, nEq),
//     ],
//     [
//         new Operator("<", 2, Operator.LEFT, sm),
//         new Operator(">", 2, Operator.LEFT, lg),
//     ],
//     [
//         new Operator("+", 2, Operator.LEFT, add),
//         new Operator("-", 2, Operator.LEFT, sub),
//     ],
//     [
//         new Operator("*", 2, Operator.LEFT, multi),
//         new Operator("/", 2, Operator.LEFT, div),
//         new Operator("%", 2, Operator.LEFT, mod),
//     ],
//     [
//         //
//         new Operator("!", 1, Operator.RIGHT, not),
//     ],
// ];
// //リテラル
// const lts = [
//     new Lt(
//         `[0-9]+(\\.[0-9]+)?`,
//         (lt) => String(lt),
//         (token) => parseFloat(token)
//     ),
//     new Lt(
//         `'(.*)'|"(.*)"`,
//         (lt) => `"${lt}"`,
//         (token) => token.replace(/^"/, "").replace(/"$/, "")
//     ),
// ];
// function getOperator(pattern: Token) {
//     for (let i = 0; i < opes.length; i++) {
//         for (let j = 0; j < opes[i].length; j++) {
//             const ope = opes[i][j];
//             if (ope.pattern === pattern) {
//                 return ope;
//             }
//         }
//     }
//     return null;
// }
// function getLt(token: Token) {
//     for (let i = 0; i < lts.length; i++) {
//         if (new RegExp("^(" + lts[i].pattern + ")$").test(token)) {
//             return lts[i];
//         }
//     }
//     return null;
// }
// const opePatterns = opes.reduce((p, v) => {
//     const ps = v.map((o) => o.pattern);
//     p.push(...ps);
//     return p;
// }, [] as Operator["pattern"][]);

// function toRpn(exp: string): Token[] {
//     for (let i = 0; i < opes.length; i++) {
//         for (let j = 0; j < opes[i].length; j++) {
//             const op = opes[i][j];
//             const opIdx = exp.indexOf(op.pattern);
//             if (opIdx >= 0) {
//                 //演算子含む
//                 const left = exp.slice(0, opIdx);
//                 const ope = exp.slice(opIdx, opIdx + 1);
//                 const right = exp.slice(opIdx + 1, exp.length);
//                 return [...toRpn(right), ...toRpn(left), ope];
//             }
//         }
//     }
//     return [exp];
// }
// function evalRpn(rpn: Token[]) {
//     const stack = [];
//     for (let i = 0; i < rpn.length; i++) {
//         if (opePatterns.includes(rpn[i])) {
//             const ope = getOperator(rpn[i]);
//             if (ope) {
//                 const paramsLen = ope.term;
//                 const params = [];
//                 for (let i = 0; i < paramsLen; i++) {
//                     const term = stack.pop();
//                     if (typeof term !== "undefined") {
//                         const lt = getLt(String(term));
//                         if (lt) {
//                             const termLt = lt.tokenToLt(term);
//                             console.log(
//                                 term,
//                                 "=>",
//                                 termLt,
//                                 `(${typeof termLt})`
//                             );
//                             params.push(termLt);
//                         } else {
//                             throw new Error("not implemented !!!!");
//                         }
//                     }
//                 }
//                 const opeEval = ope.eval(params);
//                 stack.push(opeEval);
//                 // console.log(...params, ope.pattern, ">>>", opeEval);
//             } else {
//                 throw new Error("not implemented !!!!");
//             }
//         } else {
//             stack.push(rpn[i]);
//         }
//     }
//     return stack[0];
// }

// export function evalFormula(exp: string) {
//     const rpn = toRpn(exp);
//     const value = evalRpn(rpn);
//     return value;
// }

import simpleEval from "simple-eval";
import { isBoolean, isBooleanArray, isBooleanArray2D, isNumberArray, isNumberArray2D, isStringArray, isStringArray2D } from "src/lib/typechecker";

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
) {
    const vars = variables.reduce(
        (ans, v) => {
            ans[v.name] = v.value;
            return ans;
        },
        {} as {
            [k: string]: VariableValue;
        }
    );
    const ctx = {
        ...vars,
        ...funcs,
    };
    console.log(ctx);

    return simpleEval(exp, ctx);
}
