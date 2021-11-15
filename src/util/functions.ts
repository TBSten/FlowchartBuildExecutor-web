import lodash from "lodash" ;


export function randomNumber(min=0, max=100,integer=true) :number{
    if(min > max){
        let w = min ;
        min = max ;
        max = w ;
    }
    let ans = Math.random()*(max-min) +min;
    if(integer){
        ans = Math.floor(ans);
    }
    return ans ;
}

export function randomStr(len=1 ) :string{
    var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var N=len;
    return Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('');
}

export function randomItemId() :string{
    let ans = "Item-"+randomStr(16)+"-"+Date.now().toString().slice(0,10) ;
    return ans ;
}

// randomItemId();


export function dimensionOf(value :any){
    let ans = 0 ;
    let w = value ;
    while(w && w instanceof Array){
        ans++;
        w = w[0] ;
    }
    return ans ;
}


export function deepCopy<V>(value:V){
    return lodash.cloneDeep(value);
}








