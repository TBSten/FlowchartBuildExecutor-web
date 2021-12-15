"use strict";
exports.__esModule = true;
function esc(str) {
    return str.replace(/[-\/\\^$*+?.()|\[\]{}]/g, '\\$&');
}
function tokenToLt(token) {
    // console.log("tokenToLt",token)
    if (new RegExp(ltPatterns[0]()).test(token)) {
        // console.log("  parseFloat",parseFloat(token))
        return parseFloat(token);
    }
    var isDoubleQuateStr = token.match(/^("(.*)")$/);
    if (isDoubleQuateStr) {
        var ans = isDoubleQuateStr[2];
        return ans;
    }
    var isSingleQuateStr = token.match(/^('(.*)')$/);
    if (isSingleQuateStr) {
        var ans = isSingleQuateStr[2];
        return ans;
    }
    if (new RegExp(ltPatterns[3]()).test(token)) {
        console.log(" use var : ", getVar(token));
        var v = getVar(token);
        if (v) {
            return v.value;
        }
        // return v ? v.value : null ;
    }
    throw new Error("unvalid token :" + token);
}
function ltToToken(lt) {
    // console.log(lt,lt.toString())
    // console.log("ltToToken",lt,typeof lt);
    if (typeof lt === "string") {
        return "'" + lt + "'";
    }
    if (typeof lt === "number") {
        return lt.toString();
    }
    throw new Error("unvalid lt :" + lt);
}
function getOpe(opeToken) {
    var ope = opes.reduce(function (p, v) {
        return new RegExp(v.pattern).test(opeToken) ? v : p;
    }, null);
    return ope;
}
function getVar(name) {
    var ans = variables.reduce(function (p, v) {
        if (v.name === name) {
            return v;
        }
        return p;
    }, null);
    return ans;
}
var opes = [
    {
        pattern: esc("+"),
        run: function (left, right) {
            if (left && right) {
                var leftLt = tokenToLt(left);
                var rightLt = tokenToLt(right);
                if (typeof leftLt === "string" && typeof rightLt === "string") {
                    return leftLt + rightLt;
                }
                else if (typeof leftLt === "string" && typeof rightLt === "number") {
                    return leftLt + rightLt;
                }
                else if (typeof leftLt === "number" && typeof rightLt === "string") {
                    return leftLt + rightLt;
                }
                else if (typeof leftLt === "number" && typeof rightLt === "number") {
                    return leftLt + rightLt;
                }
            }
            throw new Error("+演算子の左辺または右辺が不正です");
        }
    },
    {
        pattern: esc("-"),
        run: function (left, right) {
            if (left && right) {
                var lLt = tokenToLt(left);
                var rLt = tokenToLt(right);
                if (typeof lLt === "number" && typeof rLt === "number") {
                    return lLt - rLt;
                }
            }
            throw new Error("-演算子の左辺または右辺が不正です");
        }
    },
    {
        pattern: esc("*"),
        run: function (left, right) {
            if (left && right) {
                var lLt = tokenToLt(left);
                var rLt = tokenToLt(right);
                if (typeof lLt === "number" && typeof rLt === "number") {
                    // console.log(lLt*rLt)
                    return lLt * rLt;
                }
            }
            console.log(left, right);
            throw new Error("*演算子の左辺または右辺が不正です");
        }
    },
    {
        pattern: esc("/"),
        run: function (left, right) {
            if (left && right) {
                var lLt = tokenToLt(left);
                var rLt = tokenToLt(right);
                if (typeof lLt === "number" && typeof rLt === "number") {
                    return lLt / rLt;
                }
            }
            throw new Error("/演算子の左辺または右辺が不正です");
        }
    },
];
var ltPatterns = [
    function () { return "^([0-9]+)$"; },
    function () { return "\".*\""; },
    function () { return "'.*'"; },
    function () {
        var varPattern = variables.map(function (v) { return v.name; }).join("|");
        return varPattern ? varPattern : "<<>>";
    }
];
function isOpe(token) {
    return new RegExp("^(" + opes.map(function (o) { return o.pattern; }).join("|") + ")$").test(token);
}
var variables = [];
function isLt(token) {
    // return (
    //     /[0-9]/.test(token) || 
    //     /"(.*)"/.test(token) ||
    //     /'(.*)'/.test(token)
    // ) ;
    return ltPatterns.reduce(function (p, ltp) {
        // console.log("-------",token,ltp,new RegExp(ltp).test(token))
        return p || new RegExp(ltp()).test(token);
    }, false);
}
function priority(opeToken) {
    if (opeToken === "+") {
        return 1;
    }
    else if (opeToken === "-") {
        return 1;
    }
    else if (opeToken === "*") {
        return 2;
    }
    else if (opeToken === "/") {
        return 2;
    }
    throw new Error("unvalid operator : " + opeToken);
}
function toTokens(formula) {
    return formula.split(new RegExp("(" +
        ("" + opes.map(function (o) { return o.pattern; }).join("|")) + //演算子
        ("|" + ltPatterns.map(function (ltp) { return ltp(); }).join("|")) +
        "|\\(|\\)" +
        ")")).filter(function (t) { return t; }).map(function (t) { return t.replace(" ", ""); });
}
function toRpn(tokens) {
    var ans = [];
    var _st = [];
    _st.top = function () { return stack[stack.length - 1]; };
    var stack = _st;
    for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (isLt(t)) { //数字などのリテラル
            ans.push(t);
        }
        else if (isOpe(t)) { //演算子
            while (true) {
                if (!stack.top()) {
                    break;
                }
                if (!(isOpe(stack.top()) && priority(t) <= priority(stack.top()))) {
                    break;
                }
                var o2 = stack.pop();
                if (o2) {
                    ans.push(o2);
                }
                else {
                    throw new Error("unknown error o2 :" + o2);
                }
            }
            stack.push(t);
        }
        else if (t === "(") {
            stack.push(t);
        }
        else if (t === ")") {
            while (stack.length > 0 && stack.top() !== "(") {
                var t_1 = stack.pop();
                if (t_1) {
                    ans.push(t_1);
                }
                else {
                    throw new Error("unknown error t:" + t_1);
                }
            }
            if (stack.top() === "(") {
                stack.pop();
            }
            else {
                throw new Error(" ### カッコの数が正しくありません");
            }
        }
        else {
            console.error(" ?????????????????????????????");
        }
    }
    for (var i = stack.length - 1; i >= 0; i--) {
        var t = stack[i];
        if (t === "(") {
            throw new Error(" ### カッコの数が正しくありません");
        }
        if (isOpe(t)) {
            ans.push(t);
        }
        else {
            console.error(ans, stack, t, i);
            throw new Error(" 不正な式です");
        }
    }
    return ans;
}
function evalRpn(rpn) {
    var ans = [];
    rpn.forEach(function (token) {
        if (isLt(token)) {
            var lt = tokenToLt(token);
            if (lt) {
                ans.push(lt);
            }
            else {
                throw new Error("unknown error");
            }
        }
        else if (isOpe(token)) {
            var right = ans.pop();
            var left = ans.pop();
            var ope = getOpe(token);
            if (left && right && ope) {
                var calced = ope.run(ltToToken(left), ltToToken(right));
                ans.push(calced);
            }
        }
        else {
            throw new Error("unvalid formula : on token is " + token);
        }
    });
    if (ans.length === 1) {
        // return tokenToLt(ans[0]) ;
        return ans[0];
    }
    else {
        console.error(rpn);
        throw new Error("unvalid formula ");
    }
}
function evalFormula(formula, vars) {
    if (vars === void 0) { vars = []; }
    variables = vars;
    var ts = toTokens(formula);
    var rpn = toRpn(ts);
    var ans = evalRpn(rpn);
    return ans;
}
console.clear();
var formulas = [
    "1+2",
    "1+22+33",
    "1*2+3",
    "1+2*3",
    "(1+2)*3",
    "\"1+2=\"+(1+2)",
    "x+y+z",
];
formulas.forEach(function (f) {
    console.log("================================================");
    console.log(f);
    console.log(" ==>> ");
    console.log(evalFormula(f, [
        { name: "x", value: 123 },
        { name: "y", value: 456 },
        { name: "z", value: 789 },
    ]));
    console.log("\n");
});
