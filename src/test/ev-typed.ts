
export type Token = string ;
export type Lt = string | number | boolean ;
export type Ope = {
    pattern:string,
    run:(left:Token,right?:Token)=>Lt 
} ;
export type Variable = {
    name:string,
    value:Lt,
} ;

function esc(str:string){
    return str.replace(/[-\/\\^$*+?.()|\[\]{}]/g, '\\$&');
}
function tokenToLt(token:Token){
    // console.log("tokenToLt",token)
    if(new RegExp(ltPatterns[0]()).test(token)){
        // console.log("  parseFloat",parseFloat(token))
        return parseFloat(token);
    }
    const isDoubleQuateStr = token.match(/^("(.*)")$/) ;
    if(isDoubleQuateStr){
        const ans = isDoubleQuateStr[2];
        return ans
    }
    const isSingleQuateStr = token.match(/^('(.*)')$/) ;
    if(isSingleQuateStr){
        const ans = isSingleQuateStr[2];
        return ans ;
    }
    if(new RegExp(ltPatterns[3]()).test(token)){
        console.log(" use var : ",getVar(token))
        const v = getVar(token) ;
        if(v){
            return v.value ;
        }
        // return v ? v.value : null ;
    }
    throw new Error("unvalid token :"+token) ;
}
function ltToToken(lt:Lt){
    // console.log(lt,lt.toString())
    // console.log("ltToToken",lt,typeof lt);
    if(typeof lt === "string"){
        return "'"+lt+"'" ;
    }
    if(typeof lt === "number" ){
        return lt.toString() ;
    }
    throw new Error("unvalid lt :"+lt) ;
}
function getOpe(opeToken:Token){
    const ope :Ope|null = opes.reduce((p,v)=>{
        return new RegExp(v.pattern).test(opeToken) ? v : p ;
    },null as null | Ope);
    return ope ;
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

const opes :Ope[] = [
    {
        pattern:esc("+"),
        run:(left,right)=>{
            if(left && right){
                const leftLt = tokenToLt(left) ;
                const rightLt = tokenToLt(right) ;
                if(typeof leftLt === "string" && typeof rightLt === "string"){
                    return leftLt+rightLt;
                }else if(typeof leftLt === "string" && typeof rightLt === "number"){
                    return leftLt+rightLt;
                }else if(typeof leftLt === "number" && typeof rightLt === "string"){
                    return leftLt+rightLt;
                }else if(typeof leftLt === "number" && typeof rightLt === "number"){
                    return leftLt+rightLt;
                }
            }
            throw new Error("+演算子の左辺または右辺が不正です") ;
        }
    },
    {
        pattern:esc("-"),
        run:(left,right)=>{
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
        run:(left,right)=>{
            if(left && right){
                const lLt = tokenToLt(left) ;
                const rLt = tokenToLt(right) ;
                if(typeof lLt === "number" && typeof rLt === "number"){
                    // console.log(lLt*rLt)
                    return lLt * rLt ;
                }
            }
            console.log(left,right);
            throw new Error("*演算子の左辺または右辺が不正です") ;
        }
    },
    {
        pattern:esc("/"),
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
] ;
const ltPatterns = [
    ()=>`^([0-9]+)$`,
    ()=>`".*"`,
    ()=>`'.*'`,
    ()=>{
        const varPattern = variables.map(v=>v.name).join("|") ;
        return varPattern?varPattern:"<<>>" ;
    }
] ;
function isOpe(token:Token){
    return new RegExp(`^(${opes.map(o=>o.pattern).join("|")})$`).test(token);
}
let variables :Variable[] = [] ;
function isLt(token:Token){
    // return (
    //     /[0-9]/.test(token) || 
    //     /"(.*)"/.test(token) ||
    //     /'(.*)'/.test(token)
    // ) ;
    return ltPatterns.reduce((p,ltp)=>{
        // console.log("-------",token,ltp,new RegExp(ltp).test(token))
        return p || new RegExp(ltp()).test(token) ;
    },false);
}
function priority(opeToken:Token){
    if(opeToken === "+"){
        return 1 ;
    }else if(opeToken === "-"){
        return 1 ;
    }else if(opeToken === "*"){
        return 2 ;
    }else if(opeToken === "/"){
        return 2 ;
    }
    throw new Error("unvalid operator : "+opeToken) ;
}

function toTokens(formula:string){
    return formula.split(new RegExp(
        `(`+
            `${opes.map(o=>o.pattern).join("|")}`+     //演算子
            `|${ltPatterns.map(ltp=>ltp()).join("|")}`+
            `|\\(|\\)`+
        `)`
    )).filter(t=>t).map(t=>t.replace(" ",""));
}

function toRpn(tokens:Token[]):Token[]{
    const ans :Token[] = [] ;
    const _st:any = [] ;
    _st.top = ()=> stack[stack.length-1] ;
    const stack :Array<Token> & {top:Function} = _st ;
    for(let i = 0 ;i < tokens.length;i++){
        const t = tokens[i] ;
        if(isLt(t)){//数字などのリテラル
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
        }else{
            console.error(" ?????????????????????????????")
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
            console.error(ans,stack,t,i)
            throw new Error(" 不正な式です") ;
        }
    }
    return ans ;
}
function evalRpn(rpn:Token[]){
    const ans :Lt[] = [] ;
    rpn.forEach(token=>{
        if(isLt(token)){
            const lt = tokenToLt(token) ;
            if(lt){
                ans.push(lt);
            }else{
                throw new Error("unknown error");
            }
        }else if(isOpe(token)){
            const right = ans.pop();
            const left = ans.pop() ;
            const ope = getOpe(token) ;
            if(left && right && ope){
                const calced = ope.run(ltToToken(left),ltToToken(right)) ;
                ans.push(calced);
            }
        }else{
            throw new Error("unvalid formula : on token is "+token);
        }
    });
    if(ans.length === 1){
        // return tokenToLt(ans[0]) ;
        return ans[0] ;
    }else {
        console.error(rpn)
        throw new Error("unvalid formula ") ;
    }
}
function evalFormula(formula:string,vars:Variable[]=[]){
    variables=vars ;
    const ts = toTokens(formula);
    const rpn = toRpn(ts);
    const ans = evalRpn(rpn);
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
test() ;

export {
    evalFormula,
} ;

