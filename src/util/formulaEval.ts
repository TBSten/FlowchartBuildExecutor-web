import { ArrayBaseType, Variable, VariableValue } from "exe/runtimes/types";

function regEscape(str: string) {
  return str.replace(/[-\/\\^$*+?.()|\[\]{}]/g, "\\$&");
}
export class Evaler {
  vars: Variable[];
  opes = [
    "+",
    "-",
    "*",
    "/",
    "^",
    "(",
    ")",
    "[",
    "]",
    "<",
    ">",
    "<=",
    ">=",
    "=",
    "!=",
    "<>",
    // ",",
  ];
  constructor(vars: Variable[]) {
    this.vars = vars;
  }
  eval(formula: string) {
    const tokens = this.toTokens(formula);
    //console.log("tokens", tokens);
    const gp = this.toGp(tokens);
    // //console.log("gp",gp);
    const ans = this.gpEval(gp);
    // //console.log(ans);
    return this.tokenToLt(ans);
  }
  toTokens(formula: string): string[] {
    formula = formula.replace(" ", "");
    let ans = formula.split(
      new RegExp(`(${this.opes.map((el) => regEscape(el)).join("|")})`)
    );
    ans = ans.map((el) => el.replace(" ", ""));
    //console.log(ans);
    ans = ans.filter((el) => el !== "");
    //console.log(ans);
    return ans;
  }
  toGp(tokens: string[]): string[] {
    const ans = [] as string[];
    const stack = [] as string[];
    tokens.forEach((token) => {
      // //console.log("isOpeToken",token,"is",this.isOpeToken(token));
      if (this.isOpeToken(token)) {
        if (token === "(" || token === "[") {
          // //console.log("stack.push",token);
          stack.push(token);
        } else if (token === ")") {
          let w = stack.pop();
          while (w !== "(") {
            if (w) {
              ans.push(w);
              w = stack.pop();
            } else {
              throw new Error("()カッコの数がおかしい");
            }
          }
        } else if (token === "]") {
          // //console.log("token is ]",stack);
          let w = stack.pop();
          while (w !== "[") {
            // //console.log("in []",w,stack,ans);
            if (w) {
              ans.push(w);
              w = stack.pop();
            } else {
              throw new Error("[]カッコの数がおかしい");
            }
          }
          ans.push("[");
        } else {
          //演算子
          if (stack.length >= 0 && this.isOpeToken(stack[stack.length - 1])) {
            //stackのトップに演算子トークンあり
            let stackTop = stack[stack.length - 1];
            // //console.log("stackTop",stackTop,stack);
            while (
              stackTop &&
              this.getOpePriority(stackTop) >= this.getOpePriority(token)
            ) {
              ans.push(stack.pop() as string);
              // //console.log("stackTop",stackTop,stack);
              stackTop = stack[stack.length - 1];
            }
          }
          stack.push(token);
        }
      } else {
        //digit
        ans.push(token);
      }
    });
    for (let i = stack.length - 1; i >= 0; i--) {
      ans.push(stack[i]);
    }
    return ans;
  }
  gpEval(gp: string[]): string {
    //console.log("gpEval", gp);
    const stack = [] as string[];
    for (let i = 0; i < gp.length; i++) {
      let t = gp[i];
      // //console.log("gpEval",t);
      if (this.isOpeToken(t)) {
        if (t === "[" || t === "]") {
          const key = stack.pop();
          const ref = stack.pop();
          let refVariable: null | VariableValue = null;
          this.vars.forEach((el) => {
            if (el.name === ref) {
              refVariable = el.value;
            }
          });
          if (refVariable && key) {
            stack.push(
              this.ltToToken(refVariable[this.tokenToLt(key) as number])
            );
          } else {
            throw new Error("unvalid ref of key" + ref + "" + key);
          }
        } else {
          //ope
          const w2 = stack.pop();
          const w1 = stack.pop();
          if (w1 && w2) {
            const calced = this.calcLeftOpeRight(w1, t, w2);
            stack.push(calced);
          } else {
            console.error("# Error gp:", gp);
            throw new Error("unvalid values:" + w1 + "," + w2);
          }
        }
      } else {
        //digit
        // if t is array,
        //     next value is index
        stack.push(t);
      }
    }
    if (stack.length === 1) {
      return stack[0];
    } else {
      //console.log(stack);
      throw new Error("unvalid formula ");
    }
  }

  isNumberToken(t: string): boolean {
    const ans = t.match(/^((\+|\-)?[0-9]+(.[0-9]+)?)$/);
    return ans ? true : false;
  }
  isStringToken(t: string) {
    const ans = t.match(/^(\"(.*)\")$/);
    return ans ? true : false;
  }
  isBooleanToken(t: string) {
    const ans = t.match(/^(true|false)$/);
    return ans ? true : false;
  }
  isVariableToken(t: string): boolean {
    //プリミティブ
    //this.vars内にあるか判定
    let ans = false;
    this.vars.forEach((el) => {
      if (el.name === t) {
        ans = true;
      }
    });
    return ans;
  }
  isOpeToken(t: string) {
    const ans = new RegExp(
      `^(${this.opes.map((el) => regEscape(el)).join("|")})$`
    ).test(t);
    return ans;
  }
  getOpePriority(ope: string) {
    if(ope === ","){
      return 0;
    }else if (ope === "[" || ope === "]") {
      return 1;
    } else if (
      ope === ">" ||
      ope === "<" ||
      ope === ">=" ||
      ope === "<=" ||
      ope === "=" ||
      ope === "!=" ||
      ope === "!="
    ) {
      return 2;
    } else if (ope === "+" || ope === "-") {
      return 3;
    } else if (ope === "*" || ope === "/") {
      return 4;
    } else if (ope === "^") {
      return 5;
    } else {
      throw new Error("unvalid ope :" + ope);
    }
  }
  tokenToLt(token: string): VariableValue {
    if (this.isNumberToken(token)) {
      return parseFloat(token);
    } else if (this.isStringToken(token)) {
      const matcher = token.match(/\"(.*)\"/);
      if (matcher) {
        return matcher[1];
      } else {
        throw new Error("unvalid string token :" + token);
      }
    } else if (this.isBooleanToken(token)) {
      return token === "true" ? true : false;
    } else if (this.isVariableToken(token)) {
      //プリミティブ
      //this.vars内にあるか判定
      let ans: null | VariableValue = null;
      this.vars.forEach((el) => {
        if (el.name === token) {
          ans = el.value;
        }
      });
      if (ans === null) {
        throw new Error("unvalid variable value :" + ans);
      }
      return ans;
    }
    throw new Error("unvalid literal :" + token);
  }
  ltToToken(lt: VariableValue): string {
    if (typeof lt === "number") {
      return lt.toString();
    } else if (typeof lt === "string") {
      return '"' + lt + '"';
    } else if (typeof lt === "boolean") {
      return lt ? "true" : "false";
    }
    //配列に対応させたい
    throw new Error("unvalid literal :" + lt);
  }

  calcLeftOpeRight(l: string, o: string, r: string): string {
    if (o === "+") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL + rL;
        return this.ltToToken(ans);
      } else if (typeof lL === "string" && typeof rL === "number") {
        const ans = lL + rL;
        return this.ltToToken(ans);
      } else if (typeof lL === "number" && typeof rL === "string") {
        const ans = lL + rL;
        return this.ltToToken(ans);
      } else if (typeof lL === "string" && typeof rL === "string") {
        const ans = lL + rL;
        return this.ltToToken(ans);
      } else {
        throw new Error("unvalid add calc types : " + lL + " + " + rL);
      }
    } else if (o === "-") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL - rL;
        return this.ltToToken(ans);
      }
    } else if (o === "*") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL * rL;
        return this.ltToToken(ans);
      }
    } else if (o === "/") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL / rL;
        return this.ltToToken(ans);
      }
    } else if (o === "^") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL ** rL;
        return this.ltToToken(ans);
      }
    } else if (o === ">") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL > rL;
        return this.ltToToken(ans);
      }
    } else if (o === "<") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL < rL;
        return this.ltToToken(ans);
      }
    } else if (o === ">=") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL >= rL;
        return this.ltToToken(ans);
      }
    } else if (o === "<=") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL <= rL;
        return this.ltToToken(ans);
      }
    } else if (o === "=") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL === rL;
        return this.ltToToken(ans);
      }
    } else if (o === "!=" || o === "<>") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if (typeof lL === "number" && typeof rL === "number") {
        const ans = lL !== rL;
        return this.ltToToken(ans);
      }
    } else if(o === ",") {
      const lL = this.tokenToLt(l);
      const rL = this.tokenToLt(r);
      if(lL instanceof Array ){
        const ans = [...lL, rL];
        return this.ltToToken(ans as ArrayBaseType);
      } else {
        const ans = [lL, rL];
        return this.ltToToken(ans as ArrayBaseType);
      }
    }
    throw new Error("unvalid ope :" + o);
  }
}

export function test() {
  //console.log("eval test !!!");
  const vars = [
    { name: "test", value: "iine !" },
    { name: "変数", value: 10 },
    { name: "ARR", value: ["this is ", 3, " length array"] },
  ];
  const evaler = new Evaler(vars);
  const fs = [
    "1+2",
    "1-2+3",
    "2+3*4",
    "3*4+2",
    "変数+2",
    'test+"aaa"',
    "ARR[2-1]",
    "ARR[0]+ARR[1]+ARR[2]",
    "ARR[1-1]",
  ];
  //console.log("variables:::", vars);
  fs.forEach((el) => {
    //console.log("============");
    const st = new Date();
    const ans = evaler.eval(el);
    const et = new Date();
    //console.log(el, "==>>", ans);
    //console.log(typeof ans);
    //console.log("time :", et.valueOf() - st.valueOf(), "ms");
  });
  //console.log("============");
}
