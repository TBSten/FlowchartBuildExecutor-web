import { v4 as uuidv4 } from "uuid" ;


export function makeItemId(pre:string="item-id") :string{
    const uuid = uuidv4() ;
    return `${pre}-${uuid}` ;
} ;


export const corners = ( width:number, height:number, lw:number)=>{
    return {

        topLeft:{
            x:lw/2,
            y:lw/2,
        },
        topCenter:{
            x:width/2-lw/2,
            y:lw/2,
        },
        topRight:{
            x:width-lw/2,
            y:lw/2,
        },
        
        centerLeft:{
            x:lw/2,
            y:height/2-lw/2,
        },
        centerCenter:{
            x:width/2-lw/2,
            y:height/2-lw/2,
        },
        centerRight:{
            x:width-lw/2,
            y:height/2-lw/2,
        },
        
        bottomLeft:{
            x:lw/2,
            y:height-lw/2,
        },
        bottomCenter:{
            x:width/2,
            y:height-lw/2,
        },
        bottomRight:{
            x:width-lw/2,
            y:height-lw/2,
        },

        width:width-lw,
        height:height-lw,
    } ;
}  ;

