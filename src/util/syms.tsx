// import { ReactNode } from "react";
import {TextField, Select, Checkbox, MenuItem, } from "@material-ui/core" ;
import { FC } from "react";


export type OptionType = {
    input: FC<{
        name :string, 
        value :string | number | boolean, 
        args :string | number | boolean | string[] | number[] | object,
        updateOption :(name :string,value :string | number)=>void,
    }>,

} ;

export const optionTypes :{ [key :string]:OptionType } = {
    "text":{
        input:({name,value,updateOption})=>(
            <TextField variant="outlined" value={value} onChange={(e)=>{updateOption(name,e.target.value);}}/>
        ),
    },
    "check":{
        input:({name,value,updateOption})=>(
            <Checkbox value={value} onChange={(e)=>{updateOption(name,e.target.value);}}/>
        ),
    },
    "select":{
        input:({name,value,args,updateOption})=>(
            <Select value={value} onChange={(e)=>{updateOption(name,e.target.value as string);}}>
                {
                    (args as string[]).map((ele,idx)=>(
                        <MenuItem key={idx} value={ele}>{ele}</MenuItem>
                    ))
                }
            </Select>
        ),
    },
} as const;
