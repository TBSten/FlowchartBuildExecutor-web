

export const nullable = <T>(arg:T|null):T=>{
    if(arg !== null){
        return arg ;
    }
    throw new Error(arg+" can not be null") ;
} ;








