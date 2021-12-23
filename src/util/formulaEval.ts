import { FormatStrikethroughTwoTone } from "@material-ui/icons";

export type Token = string ;
export type Lt = 
    string | number | boolean | 
    string[] | number[] | boolean[] ;
export type Ope = {
    pattern:string ,
    run:(left?:Token,right?:Token)=>Lt ,
    priority:number,
} ;

export type Variable = {
    name:string,
    value:Lt,
} ;

export type FuncArgs = Lt[];
export type Func = {
    name:string,
    call:(args:FuncArgs)=>(void|Lt|Promise<Lt|void>)
} ;

function esc(str:string){
    return str.replace(/[-\/\\^$*+?.()|\[\]{}]/g, '\\$&');
}
function tokenToLt(token:Token):Lt{
    // console.log("tokenToLt",token)
    if(new RegExp(`^(${ltPatterns[0]()})$`,"g").test(token)){   //number
        // console.log(new RegExp(ltPatterns[0](),"g"))
        return parseFloat(token);
    }
    const isDoubleQuateStr = token.match(/^("(.*)")$/) ;
    if(isDoubleQuateStr){   //"" string
        const ans = isDoubleQuateStr[2];
        return ans
    }
    const isSingleQuateStr = token.match(/^('(.*)')$/) ;
    if(isSingleQuateStr){       //'' string
        const ans = isSingleQuateStr[2];
        return ans ;
    }
    if(token === "true" || token === "false"){  //boolean
        return token === "true" ? true : false ;
    }
    if(new RegExp(ltPatterns[3](),"g").test(token)){    //variable
        console.log(" use var : ",getVar(token))
        const v = getVar(token) ;
        if(v){
            return v.value ;
        }
        // return v ? v.value : null ;
    }
    throw new Error("unvalid token :"+token) ;
}
function callFunction(token:Token,args:Lt[]){
    if(new RegExp(ltPatterns[4](),"g").test(token)){    //function
        const func = getFunction(token);
        if(func){
            console.log(token,"called with",args);
            const returnedValue = func.call(args);
            if(returnedValue instanceof Promise){
                throw new Error(token+" is not callable function") ;
            }else{
                if(returnedValue){
                    console.log("  returned",returnedValue);
                    return returnedValue ;
                }else{
                    throw new Error(returnedValue+" is returned from "+token+" but unvalid") ;
                }
            }
        }else{
            throw new Error (func+" is not function") ;
        }
    }

}
function ltToToken(lt:Lt):Token{
    // console.log(lt,lt.toString())
    // console.log("ltToToken",lt,typeof lt);
    if(typeof lt === "string"){
        return "'"+lt+"'" ;
    }
    if(typeof lt === "number" ){
        return lt.toString() ;
    }
    if(typeof lt === "boolean"){
        return lt ? "true" : "false" ;
    }
    if(lt === undefined){
        return "undefined" ;
    }
    throw new Error("unvalid lt :"+lt) ;
}
function getOpe(opeToken:Token){
    const sorted = opes.sort((o1,o2)=>o2.pattern.length - o1.pattern.length) ;
    // console.log("sorted",sorted)
    // const ope :Ope|null = sorted.reduce((p,v)=>{
    //     return new RegExp(v.pattern).test(opeToken) ? v : p ;
    // },null as null | Ope);
    const ope = sorted.find(o=>new RegExp(o.pattern).test(opeToken)) ;
    return ope !== undefined ? ope : null ;
}
function getVar(name:string){
    const ans = variables.reduce((p,v)=>{
        if(v.name === name){
            return v ;
        }
        return p ;
    },null as null | Variable);
    return ans ;
}
function getFunction(name:string){
    const ans = funcs.find((func)=>func.name === name);
    return ans ? ans : null ;
}

/*

7	%,^
6	*,/
5	+,-
4	=,>,<,>=,<=,!=,<>
3	かつ,または

*/
const opes :Ope[] = [
    {
        pattern:esc("+"),
        priority:5,
        run:(left,right)=>{
            if(left === undefined && right !== undefined){
                const rLt = tokenToLt(right) ;
                if(typeof rLt === "number"){
                    return rLt ;
                }
            }
            if(left && right){
                const lLt = tokenToLt(left) ;
                const rLt = tokenToLt(right) ;
                if(typeof lLt === "number" && typeof rLt === "number"){
                    return lLt + rLt ;
                }
                if(typeof lLt === "string" && typeof rLt === "number"){
                    return lLt + rLt ;
                }
                if(typeof lLt === "number" && typeof rLt === "string"){
                    return lLt + rLt ;
                }
                if(typeof lLt === "string" && typeof rLt === "string"){
                    return lLt + rLt ;
                }
            }
            console.error(left,right);
            throw new Error("+演算子の左辺または右辺が不正です") ;
        }
    },
    {
        pattern:esc("-"),
        priority:5,
        run:(left,right)=>{
            if(left === undefined && right !== undefined){
                const rLt = tokenToLt(right) ;
                if(typeof rLt === "number"){
                    return -1 * rLt ;
                }
            }
            if(left && right){
                const lLt = tokenToLt(left) ;
                const rLt = tokenToLt(right) ;
                if(typeof lLt === "number" && typeof rLt === "number"){
                    return lLt - rLt ;
                }
            }
            throw new Error("-演算子の左辺または右辺が不正です") ;
        }
    },
    {
        pattern:esc("*"),
        priority:6,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left) ;
                const rLt = tokenToLt(right) ;
                if(typeof lLt === "number" && typeof rLt === "number"){
                    // console.log(lLt*rLt)
                    return lLt * rLt ;
                }
            }
            // console.log(left,right);
            throw new Error("*演算子の左辺または右辺が不正です") ;
        }
    },
    {
        pattern:esc("/"),
        priority:6,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left) ;
                const rLt = tokenToLt(right) ;
                if(typeof lLt === "number" && typeof rLt === "number"){
                    return lLt / rLt ;
                }
            }
            throw new Error("/演算子の左辺または右辺が不正です") ;
        }
    },
    {
        pattern:esc("%"),
        priority:7,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                if(typeof lLt === "number" && typeof rLt === "number"){
                    return lLt % rLt ;
                }
            }
            throw new Error("%演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc("^"),
        priority:7,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                if(typeof lLt === "number" && typeof rLt === "number"){
                    return Math.pow(lLt,rLt) ;
                }
            }
            throw new Error("^演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc("="),
        priority:4,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                return lLt === rLt ;
            }
            throw new Error("=演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc(">"),
        priority:4,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                return lLt > rLt ;
            }
            throw new Error(">演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc("<"),
        priority:4,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                return lLt < rLt ;
            }
            throw new Error("<演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc(">="),
        priority:4,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                return lLt >= rLt ;
            }
            throw new Error(">=演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc("<="),
        priority:4,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                return lLt <= rLt ;
            }
            throw new Error("<=演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc("!="),
        priority:4,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                return lLt !== rLt ;
            }
            throw new Error("!=演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc("<>"),
        priority:4,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                return lLt !== rLt ;
            }
            throw new Error("<>演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc("かつ"),
        priority:3,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                return lLt && rLt ? true : false;
            }
            throw new Error("かつ演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc("または"),
        priority:3,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                return lLt || rLt ? true : false;
            }
            throw new Error("または演算子の左辺または右辺が不正です") ;
        },
    },
    {
        pattern:esc("又は"),
        priority:3,
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left);
                const rLt = tokenToLt(right);
                return lLt || rLt ? true : false;
            }
            throw new Error("または演算子の左辺または右辺が不正です") ;
        },
    },

] ;
const ltPatterns = [
    ()=>`(?:[0-9]+(?:\\.[0-9]*)?)`,
    ()=>`".*"`,
    ()=>`'.*'`,
    ()=>{
        const varPattern = variables.map(v=>v.name).join("|") ;
        return varPattern?varPattern:"[[[[]]]]<<<<>>>>" ;
    },
    ()=>{
        const funcPattern = funcs.map(f=>f.name).filter(f=>f !== "").join("|") ;
        return funcPattern?funcPattern:"[[[[]]]]<<<<>>>>";
    },
    ()=>"\\,",
] ;
function isOpe(token:Token){
    return new RegExp(`^(${opes.map(o=>o.pattern).join("|")})$`).test(token);
}
let variables :Variable[] = [] ;
function initVariables(vars:Variable[]){
    variables = [
        ...vars,
    ] ;
}
let funcs :Func[] = [] ;
function initFuncs(definedFuncs:Func[]){
    funcs = [
        //ビルドイン関数
        {
            name:"random",
            call:(args)=>{
                const [
                    _min=0,
                    _max=1,
                ] = args ;
                const min = Math.min(_min as number,_max as number);
                const max = Math.max(_min as number,_max as number);
                return Math.random()*(max-min) +min ;
            }
        },
        {
            name:"round",
            call:(args)=>{
                const [
                    _value,
                    _digit=0,
                ] = args ;
                if(typeof _value === "number" && typeof _digit === "number"){
                    const d = Math.pow(10,_digit) ;
                    console.log("round",_value,d);
                    return Math.round(_value*d)/d;
                }
                throw new Error(_value+" or "+_digit+" is not number") ;
            },
        },
        //ユーザ定義関数
        ...definedFuncs,
    ] ;
}

function isLt(token:Token){
    const ans = ltPatterns.reduce((p,ltp)=>{
        // console.log("ltPatterns.forEach",ltp())
        const match = new RegExp(`^(${ltp()})$`,"g").test(token) ;
        return p || match ;
    },false);
    // console.log("isLt",token,"is",ans);
    return ans ;
}
function isFunction(name:string){
    const idx = funcs.findIndex(func=>func.name === name) ;
    return idx >= 0 ;
}
function isFunctionSpliter(token:string){
    return token === "," ;
}
function priority(opeToken:Token){
    const ope = getOpe(opeToken) ;
    if(ope){
        return ope.priority ;
    }
    throw new Error("unvalid operator : "+opeToken) ;
}

function toTokens(formula:string){
    // console.log("opes",);
    const sortedOpes = opes.sort((o1,o2)=>{
        return o2.pattern.length - o1.pattern.length
    });
    return formula.split(new RegExp(
        `(`+
            `${ltPatterns.map(ltp=>ltp()).join("|")}`+
            `|${sortedOpes.map(o=>o.pattern).join("|")}`+     
            `|\\(|\\)`+
        `)`, "g"
    )).map(t=>t.replace(" ","")).filter(t=>t && t !== " ");
}

const argStartFlg = "__<<__function__arg__start__>>__" ;
function toRpn(tokens:Token[]):Token[]{
    const ans :Token[] = [] ;
    const _st:any = [] ;
    _st.top = ()=> stack[stack.length-1] ;
    const stack :Array<Token> & {top:Function} = _st ;
    for(let i = 0 ;i < tokens.length;i++){
        const t = tokens[i] ;
        if(isFunction(t)){//関数
            stack.push(t);
            ans.push(argStartFlg);
        }else if(isFunctionSpliter(t)){
            while(stack.top() !== "(" ){
                const top = stack.pop() ;
                if(top){
                    ans.push(top);
                }else{
                    console.error("top",top) ;
                    throw new Error("unknown error") ;
                }
            }
        }else if(isLt(t)){//数字などのリテラル
            ans.push(t);
        }else if(isOpe(t)){//演算子
            while(true){
                if(!stack.top()){ break }
                if(!(isOpe(stack.top()) && priority(t) <= priority(stack.top()))){ break }
                const o2 = stack.pop();
                if(o2){
                    ans.push(o2);
                }else{
                    throw new Error("unknown error o2 :"+o2) ;
                }
            }
            stack.push(t);
        }else if(t === "("){
            stack.push(t);
        }else if(t === ")"){
            while(stack.length > 0 && stack.top() !== "("){
                const t = stack.pop();
                if(t){
                    ans.push(t);
                }else{
                    throw new Error("unknown error t:"+t) ;
                }
            }
            if(stack.top() === "("){
                stack.pop();
            }else{
                throw new Error(" ### カッコの数が正しくありません") ;
            }
            if(isFunction(stack.top())){
                const fToken = stack.pop();
                if(fToken){
                    ans.push(fToken);
                }else{
                    throw new Error("unknown fToken:"+fToken) ;
                }
            }
        }else{
            console.error(" ?????????????????????????????")
            throw new Error("unvalid token :"+t) ;
        }
    }
    for(let i = stack.length-1 ; i >= 0 ; i--){
        const t = stack[i] ;
        if(t === "("){
            throw new Error(" ### カッコの数が正しくありません") ;
        }
        if(isOpe(t)){
            ans.push(t)
        }else{
            console.error("ans",ans);
            console.error("stack",stack);
            console.error("t",t);
            console.error("i",i);
            throw new Error(" 不正な式です") ;
        }
    }
    return ans ;
}
function evalRpn(rpn:Token[]){
    const ans :Lt[] = [] ;
    rpn.forEach(token=>{
        if(token === argStartFlg){
            ans.push(token);
        }else if(isFunction(token)){
            const args = [] as any[] ;
            while(ans[ans.length-1] !== argStartFlg){
                // console.log("ans",ans)
                const top = ans.pop();
                if(top || top === 0 || top === false || top === ""){
                    args.unshift(top);
                }else{
                    throw new Error("unknown error") ;
                }
            }
            if(ans.pop() !== argStartFlg){throw new Error("unknown error") ;}
            const returnedValue = callFunction(token,args);
            if(returnedValue){
                ans.push(returnedValue);
            }else{
                throw new Error("returned value is unvalid :"+returnedValue) ;
            }
        }else if(isLt(token)){
            const lt = tokenToLt(token) ;
            if(lt || lt === 0 || lt === "" || lt === false){
                ans.push(lt);
            }else{
                console.error(token)
                console.error(lt);
                throw new Error("unknown error");
            }
        }else if(isOpe(token)){
            const right = ans.pop();
            const left = ans.pop() ;
            const ope = getOpe(token) ;
            // console.log("token to ope",token,ope)
            const lLt = left === undefined ? undefined : ltToToken(left) ;
            const rLt = right === undefined ? undefined : ltToToken(right) ;
            if(ope){
                // console.log(lLt,ope,rLt);
                const calced = ope.run(lLt,rLt) ;
                // console.log("  =>",calced);
                ans.push(calced);
            }else{
                console.error(left,ope,right);
                throw new Error("unknown error");
            }
        }else{
            throw new Error("unvalid formula : on token is "+token);
        }
    });
    if(ans.length === 1){
        // return tokenToLt(ans[0]) ;
        return ans[0] ;
    }else {
        console.error("rpn",rpn);
        console.error(ans);
        throw new Error("unvalid formula ") ;
    }
}
function evalFormula(
    formula:string,
    vars:Variable[]=[],
    funcs:Func[]=[],
){

    const _start = new Date();

    initVariables(vars);
    initFuncs(funcs);

    const ts = toTokens(formula);
    console.log("tokens",ts)
    const rpn = toRpn(ts);
    console.log("rpn",rpn)
    const ans = evalRpn(rpn);
    console.log("ans",ans);
    console.log("eval ",new Date().getTime()-_start.getTime(),"ms");
    return ans ;
}

function test(){
    console.clear()
    const formulas = [
        "1+2",
        "1+22+33",
        "1*2+3",
        "1+2*3",
        "(1+2)*3",
        `"1+2="+(1+2)`,
        `x+y+z`,
    ] ;
    formulas.forEach(f=>{
        console.log("================================================")
        console.log(f);
        console.log(" ==>> ");
        console.log(
            evalFormula(f,[
                {name:"x",value:123},
                {name:"y",value:456},
                {name:"z",value:789},
            ])
        );
        console.log("\n")
    })
}

// test() ;

export {
    evalFormula,
} ;

