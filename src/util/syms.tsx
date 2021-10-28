// import { ReactNode } from "react";
import {TextField, Select, Checkbox, MenuItem, } from "@material-ui/core" ;
import React, { FC, useState, useEffect,  } from "react";


export type OptionType = {
    name:string;
    input: ()=>FC<{
        name :string, 
        value :string | number | boolean, 
        args :string | number | boolean | string[] | number[] | object,
        updateOption :(name :string,value :string | number | boolean)=>void,
    }>;

} ;



export const optionTypes :{ [key :string]:OptionType } = {
    "text":{
        name:"text",
        input:()=>function OptionTextField({name,value,updateOption}){
            const [inputValue,setInputValue] = useState(value);
            useEffect(()=>{
                console.log("did mount");
            },[]);
            const handleChange = (e :React.ChangeEvent<HTMLInputElement>)=>{
                setInputValue(e.target.value);
                // updateOption(name,e.target.value);

            }
            const handleUpdate = ()=>{
                updateOption(name,inputValue);
            } ;
            return (
                <TextField size="small" variant="outlined" value={inputValue} onBlur={handleUpdate} onChange={handleChange}/>
            )
        },
    },
    "check":{
        name:"check",
        input:()=>({name,value,updateOption})=>(
            <Checkbox value={value} onChange={(e)=>{updateOption(name,e.target.checked);console.log("onChange",e.target.checked)}}/>
        ),
    },
    "select":{
        name:"select",
        input:()=>({name,value,args,updateOption})=>(
            <Select value={value} onChange={(e)=>{updateOption(name,e.target.value as string);}}>
                {
                    (args as string[]).map((ele,idx)=>(
                        <MenuItem key={idx} value={ele}>{ele}</MenuItem>
                    ))
                }
            </Select>
        ),
    },
    //multi args:[{type:"text",args:null}, ]
    //arrayTemplate
    //number args:{min,max,}
} as const;

export function corners(w :number,h :number,lw :number) {
    return {
        "leftTop":[lw/2,lw/2],
        "leftCenter":[lw/2,h/2],
        "leftBottom":[lw/2,h-lw/2],
        "centerTop":[w/2,lw/2],
        "centerBottom":[w/2,h-lw/2],
        "rightTop":[w-lw/2,lw/2],
        "rightCenter":[w-lw/2,h/2],
        "rightBottom":[w-lw/2,h-lw/2],
    } as const;
}




