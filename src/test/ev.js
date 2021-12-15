function esc(str){
    return str.replace(/[-\/\\^$*+?.()|\[\]{}]/g, '\\$&');
}
function tokenToLt(token){
    // console.log("tokenToLt",token)
    if(/^[0-9]+$/.test(token)){
        // console.log("  is",parseFloat(token))
        return parseFloat(token);
    }
    if(/^(".*")$/.test(token)){
        const ans = token.match(/^("(.*)")$/)[2];
        // console.log("  is",ans)
        return ans
    }
    if(/^('.*')$/.test(token)){
        const ans = token.match(/^('(.*)')$/)[2];
        // console.log("  is",ans)
        return ans ;
    }
    if(new RegExp(ltPatterns[3]()).test(token)){
        console.log("### use var : ",getVar(token))
        return getVar(token).value ;
    }
    throw new Error("unvalid token :"+token) ;
}
function ltToToken(lt){
    // console.log(lt,lt.toString())
    if(typeof lt === "string"){
        return "'"+lt+"'" ;
    }
    if(typeof lt === "number" ){
        return lt.toString() ;
    }
    throw new Error("unvalid lt :"+lt) ;
}
function getOpe(opeToken){
    const ope = opes.reduce((p,v)=>{
        return new RegExp(v.pattern).test(opeToken) ? v : p ;
    },null);
    return ope ;
}
function getVar(name){
    const ans = variables.reduce((p,v)=>{
        if(v.name === name){
            return v ;
        }
        return p ;
    },null);
    return ans ;
}

const opes = [
    {
        pattern:esc("+"),
        run:(left,right)=>{
            // console.log("+ ran by ",left,right)
            return ltToToken(tokenToLt(left)+tokenToLt(right));
        }
    },
    {
        pattern:esc("-"),
        run:(left,right)=>ltToToken(tokenToLt(left)-tokenToLt(right))
    },
    {
        pattern:esc("*"),
        run:(left,right)=>ltToToken(tokenToLt(left)*tokenToLt(right))
    },
    {
        pattern:esc("/"),
        run:(left,right)=>ltToToken(tokenToLt(left)/tokenToLt(right))
    },
] ;
const ltPatterns = [
    ()=>`[0-9]+`,
    ()=>`".*"`,
    ()=>`'.*'`,
    ()=>{
        const varPattern = variables.map(v=>v.name).join("|") ;
        return varPattern?varPattern:"<<>>" ;
    }
] ;
function isOpe(token){
    return new RegExp(`^(${opes.map(o=>o.pattern).join("|")})$`).test(token);
}
let variables = [] ;
function isLt(token){
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
function priority(ope){
    if(ope === "+"){
        return 1 ;
    }else if(ope === "-"){
        return 1 ;
    }else if(ope === "*"){
        return 2 ;
    }else if(ope === "/"){
        return 2 ;
    }
    throw new Error("unvalid operator : "+ope) ;
}

function toTokens(formula){
    return formula.split(new RegExp(
        `(`+
            `${opes.map(o=>o.pattern).join("|")}`+     //演算子
            `|${ltPatterns.map(ltp=>ltp()).join("|")}`+
            `|\\(|\\)`+
        `)`
    )).filter(t=>t).map(t=>t.replace(" ",""));
}

function toRpn(tokens){
    const ans = [] ;
    const stack = [] ;
    stack.top = ()=> stack[stack.length-1] ;
    for(let i = 0 ;i < tokens.length;i++){
        const t = tokens[i] ;
        if(isLt(t)){//数字などのリテラル
            // console.log(" #",t,"is Lt");
            ans.push(t);
        }else if(isOpe(t)){//演算子
            // console.log(" #",t,"is Ope")
            while(true){
                if(!stack.top()){ break }
                if(!(isOpe(stack.top()) && priority(t) <= priority(stack.top()))){ break }
                const o2 = stack.pop();
                ans.push(o2);
            }
            stack.push(t);
        }else if(t === "("){
            stack.push(t);
        }else if(t === ")"){
            while(stack.length > 0 && stack.top() !== "("){
                const t = stack.pop();
                ans.push(t);
            }
            if(stack.top() === "("){
                stack.pop();
            }else{
                throw new Error(" ### カッコの数が正しくありません") ;
            }
        }else{
            console.error(" ?????????????????????????????")
        }
        // console.log("   ## ans  :",ans);
        // console.log("   ## stack:",stack);
    }
    stack.forEach(t=>{
        if(t === "("){
            throw new Error(" ### カッコの数が正しくありません") ;
        }
        if(isOpe(t)){
            ans.push(t)
        }else{
            throw new Error(" 不正な式です") ;
        }
    })
    return ans ;
}
function evalRpn(rpn){
    const ans = [] ;
    rpn.forEach(token=>{
        if(isLt(token)){
            ans.push(token);
        }else if(isOpe(token)){
            const right = ans.pop();
            const left = ans.pop();
            const calced = getOpe(token).run(left,right) ;
            // console.log("  ##",left,"and",right,"calc by",token,"is",calced); //<--------------------------------- 計算部分を実装
            ans.push(calced);
        }else{
            throw new Error("unvalid formula : on token is "+token);
        }
        // console.log("  ## ans:",ans);
    });
    if(ans.length === 1){
        return tokenToLt(ans[0]) ;
    }else {
        console.error(rpn)
        throw new Error("unvalid formula ") ;
    }
}
function evalFormula(formula,vars=[]){
    variables=vars ;
    const ts = toTokens(formula);
    // console.log(" #ts",ts);
    const rpn = toRpn(ts);
    // console.log(" #rpn",rpn);
    const ans = evalRpn(rpn);
    return ans ;
}

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
    console.log(
        f,
        " ==>> ",
        evalFormula(f,[
            {name:"x",value:123},
            {name:"y",value:456},
            {name:"z",value:789},
        ])
    );
    console.log("\n")
})



